/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, clearTimeout: true, exports: true */

var _ = require("underscore"),
  zombieAuth = require("../vows/lib/zombie_auth"),
  assert = require("chai").assert;

(function () {
  "use strict";

  exports.waitTime = 10000;

  var testAttributes = function (data) {
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
  };

  /**
    Creates a working model and automatically checks state
    is `READY_NEW` and a valid `id` immediately afterward.

    Note: This function assumes the `id` is fetched automatically.
    For models with manually created ids such as 'XM.UserAccount',
    create a topic manually.

    @param {Object} Data
    @param {Object} Vows
  */
  var create = exports.create = function (data, callback, vows) {
    var that = this,
      timeoutId,
      model = data.model,
      auto_regex = XM.Document.AUTO_NUMBER + "|" + XM.Document.AUTO_OVERRIDE_NUMBER,
      modelCallback = function (model, value) {
        if (model instanceof XM.Document && model.numberPolicy.match(auto_regex)) {
          // Check that the AUTO...NUMBER property has been set.
          if (model.get(model.documentKey) && model.id) {
            clearTimeout(timeoutId);
            model.off('change:' + model.documentKey, modelCallback);
            model.off('change:id', modelCallback);
            assert.equal(data.model.getStatusString(), 'READY_NEW');
            assert.isNumber(data.model.id);
            callback(null, data);
          }
        } else {
          clearTimeout(timeoutId);
          model.off('change:id', modelCallback);
          assert.equal(data.model.getStatusString(), 'READY_NEW');
          assert.isNumber(data.model.id);
          callback(null, data);
        }
      };

    model.on('change:id', modelCallback);
    // Add an event handler when using a model with an AUTO...NUMBER.
    if (model instanceof XM.Document && model.numberPolicy.match(auto_regex)) {
      model.on('change:' + model.documentKey, modelCallback);
    }
    model.initialize(null, {isNew: true});

    // If we don't hear back, keep going
    timeoutId = setTimeout(function () {
      assert.fail("timeout was reached on create", "");
      callback(null, data);
    }, exports.waitTime);
  };

  /**
    Saves the working model and automatically checks state
    is `READY_CLEAN` immediately afterward.

    @param {Object} Data
    @param {Object} Vows
  */
  var save = exports.save = function (data, callback, vows) {
    var that = this,
      timeoutId,
      model = data.model,
      modelCallback = function () {
        var status = model.getStatus(),
          K = XM.Model;
        if (status === K.READY_CLEAN) {
          clearTimeout(timeoutId);
          model.off('statusChange', modelCallback);

          assert.equal(data.model.getStatusString(), 'READY_CLEAN');
          testAttributes(data);

          callback(null, data);
        }
      };
    model.on('statusChange', modelCallback);
    model.save(null, {
      error: function (model, error, options) {
        assert.fail(JSON.stringify(error), "");
        callback(JSON.stringify(error));
      }
    });

    // If we don't hear back, keep going
    timeoutId = setTimeout(function () {
      assert.fail("timeout was reached on save", "");
      callback(null, data);
    }, exports.waitTime);
  };


  /**
    Check before updating the working model that the state is `READY_CLEAN`.

    @param {Object} Data
    @param {Object} Vows
  */
  var update = exports.update = function (data, callback, vows) {
    data.updated = true;
    return data;
  };

  /**
    Destorys the working model and automatically checks state
    is `DESTROYED_CLEAN` immediately afterward.

    @param {Data}
    @param {Object} Vows
  */
  var destroy = exports.destroy = function (data, callback, vows) {
    var that = this,
      timeoutId,
      model = data.model,
      modelCallback = function () {
        var status = model.getStatus(),
          K = XM.Model;
        if (status === K.DESTROYED_CLEAN) {
          clearTimeout(timeoutId);
          model.off('statusChange', modelCallback);
          assert.equal(data.model.getStatusString(), 'DESTROYED_CLEAN');
          callback(null, data);
        } else if (status === K.ERROR) {
          assert.fail(data.model.lastError || "Unspecified error on delete", "");
          callback(data.model.lastError || "Unspecified error");
        }
      };
    model.on('statusChange', modelCallback);
    model.destroy();

    // If we don't hear back, keep going
    timeoutId = setTimeout(function () {
      assert.fail("timeout was reached on delete", "");
      callback(null, data);
    }, exports.waitTime);
  };

  /**
    String all CRUD tests together so that simple models can be
    tested with a single function
   */
  var runAllCrud = exports.runAllCrud = function (data) {

    var runCrud = function () {
      var createCallback = function () {
        var saveCallback = function () {
          var secondSaveCallback = function () {
            destroy(data, data.done);
          }
          update(data);
          data.model.set(data.updateHash);
          testAttributes(data);
          save(data, secondSaveCallback);
        }


        save(data, saveCallback);

      };


      data.model = new XM[data.recordType.substring(3)]();
      assert.equal(data.model.recordType, data.recordType);

      data.model.set(data.createHash);
      // TODO: flesh out mock models
      create(data, createCallback);

    };






    zombieAuth.loadApp({callback: runCrud, verbose: true});


  };
  /*
    var context = {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM[data.recordType.substring(3)]();
            that.callback(null, data);
          };
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
            })
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
*/


}());
