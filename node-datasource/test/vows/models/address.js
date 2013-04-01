/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var XVOWS = XVOWS || {};
(function () {
  "use strict";

  var vows = require("vows"),
    assert = require("assert"),
    zombieAuth = require("../lib/zombie_auth"),
    crud = require('../lib/crud');

  var data = {
    recordType: "XM.Address",
    autoTestAttributes: true,
    createHash: {
      line1: "123 Main St"
    },
    updateHash: {
      line1: "456 Main St"
    }
  };

  vows.describe('XM.Address CRUD test').addBatch({
    'We can run the XM.Address CRUD tests ': crud.runAllCrud(data)

    // Everything else is business-logic specific tests to be run outside of crud
  }).addBatch({
    'We can take an address': {
      topic: function () {
        var that = this,
          model = new XM.AddressInfo(),
          success = function (resp) {
            that.callback(null, model);
          },
          error = function (err) {
            that.callback(err);
          };

        model.fetch({id: 41, success: success, error: error});
      },
      'if we save without changing it': {
        topic: function (model) {
          var that = this,
            success = function (resp) {
              that.callback(null, model);
            };

          return model.saveAddress({success: success});
        },
        'nothing much happens': function (error, topic) {
          assert.equal(topic.getStatusString(), "READY_CLEAN");
        }
      }
    }

  }).addBatch({
    'We can take an address that is not in use': {
      topic: function () {
        var that = this,
          model = new XM.AddressInfo(),
          success = function (resp) {
            that.callback(null, model);
          },
          error = function (err) {
            that.callback(err);
          };

        model.fetch({id: 10, success: success, error: error});
      },
      'and change and save it': {
        topic: function (model) {
          var that = this,
            success = function (resp) {
              that.callback(null, model);
            },
            error = function (err) {
              that.callback(err);
            };

          model.set({line1: "TestAddress" + Math.random()});
          model.saveAddress({success: success, error: error});
        },
        'we simply update that address': function (error, topic) {
          assert.equal(topic.get("line1").substring(0, 11), "TestAddress");
          assert.equal(topic.id, 10);
          assert.equal(topic.getStatusString(), "READY_CLEAN");
        }
      }
    }
  }).addBatch({
    'We can take an address that is in use somewhere else': {
      topic: function () {
        var that = this,
          model = new XM.AddressInfo(),
          success = function (resp) {
            that.callback(null, model);
          },
          error = function (err) {
            that.callback(err);
          };

        model.fetch({id: 3, success: success, error: error});
      },
      'and change and save it': {
        topic: function (model) {
          var that = this,
            callbackAdaptor = function (model, message, options) {
              that.callback(null, {model: model, message: message, options: options});
            };

          model.on("notify", callbackAdaptor);
          model.set({line1: "TestAddress" + Math.random()});
          model.saveAddress();
        },
        'we get asked by the model if we want to change one or change all': function (error, topic) {
          assert.isString(topic.message);
          assert.isFunction(topic.options.callback);
        },
        'and if we say we want to change all': {
          topic: function (notifyObj) {
            var that = this,
              callbackAdaptor = function (model, status, options) {
                if (model.getStatus() === XM.Model.READY_CLEAN) {
                  that.callback(null, model);
                }
              }
            notifyObj.model.on('statusChange', callbackAdaptor);
            notifyObj.options.callback(false);
          },
          'then we just save the model with the new value': function (error, topic) {
            assert.equal(topic.getStatusString(), "READY_CLEAN");
            assert.equal(topic.id, 3);
            assert.equal(topic.get("line1").substring(0, 11), "TestAddress");
          }
        }
      }
    }
  }).addBatch({
    'We can take an address that is in use somewhere else': {
      topic: function () {
        var that = this,
          model = new XM.AddressInfo(),
          success = function (resp) {
            that.callback(null, model);
          },
          error = function (err) {
            that.callback(err);
          };

        model.fetch({id: 6, success: success, error: error});
      },
      'and change and save it': {
        topic: function (model) {
          var that = this,
            callbackAdaptor = function (model, message, options) {
              that.callback(null, {model: model, message: message, options: options});
            };

          model.on("notify", callbackAdaptor);
          model.set({line1: "TestAddress" + Math.random()});
          model.saveAddress();
        },
        // redundant:
        //'we get asked by the model if we want to change one or change all': function (error, topic) {
        //  assert.isString(topic.message);
        //  assert.isFunction(topic.options.callback);
        //},
        'and if we say we want to change just the one': {
          topic: function (notifyObj) {
            var that = this,
              model = notifyObj.model,
              timeoutId,
              callbackAdaptor = function (model, status, options) {
                clearTimeout(timeoutId);
                if (model.getStatus() === XM.Model.READY_CLEAN) {
                  that.callback(null, model);
                }
              }
            // we expect the status of the original model not to change
            model.on('statusChange', callbackAdaptor);
            // we expect the timeout to get hit
            timeoutId = setTimeout(function () {
              that.callback(null, model);
            }, 5 * 1000);


            notifyObj.options.callback(true);
          },
          'then we do not change the pre-existing model': function (error, topic) {
            assert.equal(topic.get("line1").substring(0, 11), "Bedrijvenzo");
            assert.equal(topic.getStatusString(), "READY_CLEAN");
            assert.equal(topic.id, 6);
          }//,
          //'we create a new one with the new data': function (error, topic) {
          // TODO
          //}
        }
      }
    }

  //TODO: If the address is empty we set it to null


  }).export(module);
}());
