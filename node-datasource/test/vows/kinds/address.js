/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true, clearTimeout:true, setTimeout:true */

var XVOWS = XVOWS || {};
(function () {
  "use strict";

  var vows = require("vows"),
    assert = require("assert"),
    zombieAuth = require("../../mocha/lib/zombie_auth"),
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

  vows.describe('The Address Widget').addBatch({
    'When we load up our app': {
      topic: function () {
        zombieAuth.loadApp(this.callback);
      },
      'The kinds are loaded': function (error, topic) {
        assert.isObject(XV);
      }
    }
  }).addBatch({
    'We can take an address': {
      topic: function () {
        var that = this,
          widget = new XV.AddressWidget(),
          model = new XM.AddressInfo(),
          success = function (resp) {
            widget.setValue(model);
            that.callback(null, widget);
          },
          error = function (err) {
            that.callback(err);
          };

        model.fetch({id: "39", success: success, error: error}); // Ungargasse
      },
      'if we save without changing it': {
        topic: function (widget) {
          var that = this,
            success = function (resp) {
              that.callback(null, widget);
            };

          return widget.saveAddress({success: success});
        },
        'nothing much happens': function (error, topic) {
          assert.equal(topic.getValue().getStatusString(), "READY_CLEAN");
        }
      }
    }
  }).addBatch({
    'We can take an address that is not in use': {
      topic: function () {
        var that = this,
          widget = new XV.AddressWidget(),
          model = new XM.AddressInfo(),
          success = function (resp) {
            widget.setValue(model);
            that.callback(null, widget);
          },
          error = function (err) {
            that.callback(err);
          };

        model.fetch({id: "10", success: success, error: error}); // TestAddress
      },
      'and change and save it': {
        topic: function (widget) {
          var that = this,
            success = function (resp) {
              that.callback(null, widget);
            },
            error = function (err) {
              that.callback(err);
            };

          widget.getValue().set({line1: "TestAddress" + Math.random()});
          widget.saveAddress({success: success, error: error});
        },
        'we simply update that address': function (error, topic) {
          assert.equal(topic.getValue().get("line1").substring(0, 11), "TestAddress");
          assert.equal(topic.getValue().id, "10");
          assert.equal(topic.getValue().getStatusString(), "READY_CLEAN");
        }
      }
    }
  }).addBatch({
    'We can take an address that is in use somewhere else': {
      topic: function () {
        var that = this,
          widget = new XV.AddressWidget(),
          model = new XM.AddressInfo(),
          success = function (resp) {
            widget.setValue(model);
            that.callback(null, widget);
          },
          error = function (err) {
            that.callback(err);
          };

        model.fetch({id: "3", success: success, error: error}); // Xtreme toys AR
      },
      'and change and save it': {
        topic: function (widget) {
          var that = this;

          widget.getValue().set({line1: "TestAddress" + Math.random()});
          // hack doNotify to make it suit our purposes
          widget.doNotify = function (inEvent) {
            that.callback(null, inEvent);
          };
          widget.saveAddress();
        },
        'we get asked by the widget if we want to change one or change all': function (error, topic) {
          assert.isString(topic.message);
          assert.isFunction(topic.callback);
        },
        'and if we say we want to change all': {
          topic: function (notifyObj) {
            var that = this,
              callbackAdaptor = function (model, status, options) {
                if (model.getStatus() === XM.Model.READY_CLEAN) {
                  that.callback(null, model);
                }
              };

            notifyObj.model.on('statusChange', callbackAdaptor);
            notifyObj.callback({answer: true});
          },
          'then we just save the model with the new value': function (error, topic) {
            assert.equal(topic.getStatusString(), "READY_CLEAN");
            assert.equal(topic.id, "3");
            assert.equal(topic.get("line1").substring(0, 11), "TestAddress");
          }
        }
      }
    }
  }).addBatch({
    'We can take an address that is in use somewhere else': {
      topic: function () {
        var that = this,
          widget = new XV.AddressWidget(),
          model = new XM.AddressInfo(),
          success = function (resp) {
            widget.setValue(model);
            that.callback(null, widget);
          },
          error = function (err) {
            that.callback(err);
          };

        model.fetch({id: "6", success: success, error: error}); // Bedrijvenzone
      },
      'and change and save it': {
        topic: function (widget) {
          var that = this;

          widget.getValue().set({line1: "TestAddress" + Math.random()});
          // hack doNotify to make it suit our purposes
          widget.doNotify = function (inEvent) {
            that.callback(null, {widget: widget, event: inEvent});
          };
          widget.saveAddress();
        },
        'and if we say we want to change just the one': {
          topic: function (obj) {
            var that = this,
              notifyObj = obj.event,
              widget = obj.widget,
              callbackAdaptor = function (model, status, options) {
                if (model.getStatus() === XM.Model.READY_CLEAN) {
                  that.callback(null, {model: model, widget: widget});
                }
              };

            notifyObj.model.on('statusChange', callbackAdaptor);
            notifyObj.callback({answer: false}); // false = do not change all. change one.
          },
          'then the old model should have been reset to its original value': function (error, topic) {
            var model = topic.model;

            assert.equal(model.getStatusString(), "READY_CLEAN");
            assert.equal(model.id, "6");
            assert.equal(model.get("line1").substring(0, 13), "Bedrijvenzone");
          },
          'we wait a sec': {
            topic: function (obj) {
              var that = this;
              setTimeout(function () {
                that.callback(null, obj.widget.getValue());
              }, 1000);
            },
            'and the widget will now be backed by a new model with the updated information': function (error, topic) {
              assert.equal(topic.getStatusString(), "READY_CLEAN");
              assert.notEqual(topic.id, "6");
              assert.equal(topic.get("line1").substring(0, 11), "TestAddress");
            }
          }
        }
      }
    }
  }).export(module);
}());
