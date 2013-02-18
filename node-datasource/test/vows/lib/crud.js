/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, clearTimeout: true, exports: true */

var _ = require("underscore"),
  assert = require("assert");

(function () {
  "use strict";

  var waitTime = 10000;

  /**
    Performs all the CRUD tests on the model.

    Note: This function assumes the `id` is fetched automatically.
    For models with manually created ids such as 'XM.UserAccount',
    create a topic manually.

    @param {String} modelName
    @param {createHash} Properties to pass into the creation of the model
    @param {updateHash} Properties to test updating
  */
  exports.testCrudOperations = function (modelName, createHash, updateHash) {
    var model;
    var context = {
      topic: function () {
        var that = this,
          timeoutId,
          auto_regex = XM.Document.AUTO_NUMBER + "|" + XM.Document.AUTO_OVERRIDE_NUMBER,
          initCallback = function (model, value) {
            if (model instanceof XM.Document && model.numberPolicy.match(auto_regex)) {
              // Check that the AUTO...NUMBER property has been set.
              if (model.get(model.documentKey) && model.id) {
                clearTimeout(timeoutId);
                model.off('change:' + model.documentKey, initCallback);
                model.off('change:id', initCallback);
                that.callback(model);
              }
            } else {
              clearTimeout(timeoutId);
              model.off('change:id', initCallback);
              that.callback(model);
            }
          };

        model = new XM[modelName]();

        model.on('change:id', initCallback);
        // Add an event handler when using a model with an AUTO...NUMBER.
        if (model instanceof XM.Document && model.numberPolicy.match(auto_regex)) {
          model.on('change:' + model.documentKey, initCallback);
        }
        model.initialize(null, {isNew: true});

        // If we don't hear back, keep going
        timeoutId = setTimeout(function () {
          console.log("timeout was reached");
          that.callback(null, model);
        }, waitTime);
      },
      'Status is `READY_NEW`': function (model) {
        assert.equal(model.getStatusString(), 'READY_NEW');
      },
      'ID is valid': function (model) {
        assert.isNumber(model.id);
      },
      'And then we can set the values': {
        topic: function (model) {
          model.set(createHash);
          return model;
        },
        'Last Error is null': function (model) {
          if (model.lastError) {
            console.log("Error setting model:", JSON.stringify(model.lastError));
          }
          assert.isNull(model.lastError);
        },
        'And then we can save the values': {
          topic: function () {
            var that = this,
              saveSuccess = function (model) {
                that.callback(model);
              },
              saveError = function (model, error) {
                that.callback(model, error);
              };

            model.save(null, {success: saveSuccess, error: saveError});
          },
          'There was no error saving': function (model, error) {
            if (error) {
              console.log("Error saving model:", JSON.stringify(error));
            }
            assert.isUndefined(error && JSON.stringify(error));
          },
          'Status is `READY_CLEAN`': function (model, error) {
            assert.equal("READY_CLEAN", model.getStatusString());
          },
          'And the values are as we set them': function (model, error) {
            _.each(createHash, function (value, key) {
              if (typeof (model.get(key)) === 'object') {
                assert.equal(model.get(key).id, value);
              } else {
                assert.equal(model.get(key), value);
              }
            });
          },
         'And then we can update the values': {
            topic: function (foo, bar) {
              model.set(updateHash);
              return model;
            },
            'The updated values have been updated': function (model, err) {
              _.each(_.extend(createHash, updateHash), function (value, key) {
                if (typeof (model.get(key)) === 'object') {
                  assert.equal(model.get(key).id, value);
                } else {
                  assert.equal(model.get(key), value);
                }
              });
            },
            'And then we can save those updated values': {
              topic: function () {
                var that = this,
                  updateSuccess = function () {
                    that.callback(model);
                  },
                  updateError = function (model, error) {
                    that.callback(error);
                  };

                model.save(null, {success: updateSuccess, error: updateError});
              },
              'Status is `READY_CLEAN`': function (model) {
                assert.equal(model.getStatusString(), "READY_CLEAN");
              },
              'And then we can delete the model': {
                topic: function () {
                  var that = this,
                    destroySuccess = function (model) {
                      that.callback(model);
                    },
                    destroyError = function (error) {
                      that.callback(error);
                    };

                  model.destroy({success: destroySuccess, error: destroyError});
                },
                'Status is `DESTROYED_CLEAN`': function (model) {
                  assert.equal(model.getStatusString(), 'DESTROYED_CLEAN');
                }
              }
            } // end save of update
          } // end update
        }
      }
    };
    return context;
  };
}());
