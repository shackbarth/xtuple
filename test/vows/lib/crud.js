/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, clearTimeout: true, exports: true */

var _ = require("underscore"),
  zombieAuth = require("../../mocha/lib/zombie_auth"),
  assert = require("assert");

(function () {
  "use strict";

  exports.waitTime = 10000;

  /**
    Creates a working model and automatically checks state
    is `READY_NEW` and a valid `id` immediately afterward.

    Note: This function assumes the `id` is fetched automatically.
    For models with manually created ids such as 'XM.UserAccount',
    create a topic manually.

    @param {Object} Data
    @param {Object} Vows
  */
  var create = exports.create = function (data, vows) {
    vows = vows || {};
    var context = {
      topic: function () {
        var that = this,
          timeoutId,
          model = data.model,
          auto_regex = XM.Document.AUTO_NUMBER + "|" + XM.Document.AUTO_OVERRIDE_NUMBER,
          callback = function (model, value) {
            if (model instanceof XM.Document && model.numberPolicy.match(auto_regex)) {
              // Check that the AUTO...NUMBER property has been set.
              if (model.get(model.documentKey)) {
                clearTimeout(timeoutId);
                model.off('change:' + model.documentKey, callback);
                model.off('change:id', callback);
                that.callback(null, data);
              }
            } else {
              clearTimeout(timeoutId);
              that.callback(null, data);
            }
          };

        // Add an event handler when using a model with an AUTO...NUMBER.
        if (model instanceof XM.Document && model.numberPolicy.match(auto_regex)) {
          model.on('change:' + model.documentKey, callback);
        }
        model.initialize(null, {isNew: true});

        // If we don't hear back, keep going
        timeoutId = setTimeout(function () {
          console.log("timeout was reached");
          that.callback(null, data);
        }, exports.waitTime);

        callback(model);
      },
      'Status is `READY_NEW`': function (error, data) {
        assert.equal(data.model.getStatusString(), 'READY_NEW');
      },
      'ID is valid': function (error, data) {
        assert.isNotNull(data.model.id);
      }
    };

    // Add in any other passed vows
    _.extend(context, vows);
    return context;
  };

  /**
    Saves the working model and automatically checks state
    is `READY_CLEAN` immediately afterward.

    @param {Object} Data
    @param {Object} Vows
  */
  var save = exports.save = function (data, vows) {
    vows = vows || {};
    var context = {
      topic: function () {
        var that = this,
          timeoutId,
          model = data.model,
          callback = function () {
            var status = model.getStatus(),
              K = XM.Model;
            if (status === K.READY_CLEAN) {
              clearTimeout(timeoutId);
              model.off('statusChange', callback);
              that.callback(null, data);
            }
          };
        model.on('statusChange', callback);
        model.save(null, {
          error: function (model, error, options) {
            that.callback(JSON.stringify(error));
          }
        });

        // If we don't hear back, keep going
        timeoutId = setTimeout(function () {
          console.log("timeout was reached");
          that.callback(null, data);
        }, exports.waitTime);
      },
      'Save was successful': function (error, data) {
        assert.equal(error, null);
        assert.equal(data.model.getStatusString(), 'READY_CLEAN');
      },
      'And the values are as we set them': function (error, data) {
        if (!data.autoTestAttributes) {
          return;
        }
        var hashToTest = data.updated ? _.extend(data.createHash, data.updateHash) : data.createHash;
        _.each(hashToTest, function (value, key) {
          // depending on how we represent sub-objects, we want to verify them in different ways
          if (typeof (data.model.get(key)) === 'object' && typeof value === 'object') {
            // if the data is a model and the test hash looks like {contact: {id: 7}}
            assert.equal(data.model.get(key).id, value.id);
          } else if (key === data.model.documentKey &&
              data.model.enforceUpperKey === true) {
              // this is the document key, so it should have been made upper case
            assert.equal(data.model.get(key), value.toUpperCase());
          } else if (typeof (data.model.get(key)) === 'object' && typeof value === 'number') {
            // if the data is a model and the test hash looks like {contact: 7}
            assert.equal(data.model.get(key).id, value);
          } else {
            // default case, such as comparing strings to strings etc.
            assert.equal(data.model.get(key), value);
          }
        });
      }
    };

    // Add in any other passed vows
    _.extend(context, vows);
    return context;
  };

  /**
    Check before updating the working model that the state is `READY_CLEAN`.

    @param {Object} Data
    @param {Object} Vows
  */
  var update = exports.update = function (data, vows) {
    vows = vows || {};
    var context = {
      topic: function () {
        data.updated = true;
        return data;
      },
      'Status is `READY_CLEAN`': function (data) {
        assert.equal(data.model.getStatusString(), 'READY_CLEAN');
      }
    };

    // Add in any other passed vows
    _.extend(context, vows);
    return context;
  };

  /**
    Destorys the working model and automatically checks state
    is `DESTROYED_CLEAN` immediately afterward.

    @param {Data}
    @param {Object} Vows
  */
  var destroy = exports.destroy = function (data, vows) {
    vows = vows || {};
    var context = {
      topic: function () {
        var that = this,
          timeoutId,
          model = data.model,
          callback = function () {
            var status = model.getStatus(),
              K = XM.Model;
            if (status === K.DESTROYED_CLEAN) {
              clearTimeout(timeoutId);
              model.off('statusChange', callback);
              that.callback(null, data);
            } else if (status === K.ERROR) {
              that.callback(data.model.lastError || "Unspecified error");
            }
          };
        model.on('statusChange', callback);
        model.destroy();

        // If we don't hear back, keep going
        timeoutId = setTimeout(function () {
          console.log("timeout was reached");
          that.callback(null, data);
        }, exports.waitTime);
      },
      'Status is `DESTROYED_CLEAN`': function (error, data) {
        assert.equal(error, null);
        assert.equal(data.model.getStatusString(), 'DESTROYED_CLEAN');
      }
    };
    // Add in any other passed vows
    _.extend(context, vows);
    return context;
  };

  /**
    String all CRUD tests together so that simple models can be
    tested with a single function
   */
  var runAllCrud = exports.runAllCrud = function (data) {
    var context = {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM[data.recordType.substring(3)]();
            that.callback(null, data);
          };
        zombieAuth.loadApp({callback: callback, verbose: false});
      },
      'Verify the record type is correct': function (data) {
        assert.equal(data.model.recordType, data.recordType);
      },
      'We can create a model ': create(data, {
        '-> Set values to the model': {
          topic: function (data) {
            // allow the test to use a shorthand mock for these submodels, and
            // flesh them out here. This is very very clever.

            var that = this,
              objectsToFetch = 0,
              objectsFetched = 0,
              fetchSuccess = function (model, response, options) {
                // swap in this model for the mock
                data.model.set(options.key, model, {silent: true});
                objectsFetched++;
                if (objectsFetched === objectsToFetch) {
                  that.callback(null, data);
                }
              },
              fetchError = function () {
                console.log("Error fleshing out mock models", JSON.stringify(arguments));
                // proceed anyway.
                objectsFetched++;
                if (objectsFetched === objectsToFetch) {
                  that.callback(null, data);
                }
              };
            _.each(data.createHash, function (value, key) {
              if (typeof value === 'object') {
                var fetchObject = {
                    success: fetchSuccess,
                    error: fetchError,
                    key: key
                  },
                  relatedModel,
                  relatedModelName = _.find(data.model.relations, function (relation) {
                    return relation.key === key;
                  }).relatedModel;

                relatedModel = new XM[relatedModelName.substring(3)]();
                fetchObject[relatedModel.idAttribute] = value.id;
                relatedModel.fetch(fetchObject);
                objectsToFetch++;
              }
            });
            // if there are no models to substitute we won't be doing this whole callback
            // rigamorole.
            if (objectsToFetch === 0) {
              data.model.set(data.createHash);
              return data;
            }
          },
          // create vows
          'Verify the last error is null': function (data) {
            assert.isNull(data.model.lastError);
          },
          '-> Save the model': save(data, {
            'We can update the model ': update(data, {
              '-> Set values': {
                topic: function () {
                  data.model.set(data.updateHash);
                  return data;
                },
                '-> Commit to the model': save(data, {
                  'destroy': destroy(data)
                })
              }
            })
          })
        }
      })
    };
    return context;
  };



}());
