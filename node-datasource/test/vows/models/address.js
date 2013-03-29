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
          model = new XM.Address(),
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
    'We can take an address that is ': {
      topic: function () {
        var that = this,
          model = new XM.Address(),
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
  /*

  toytruck addresses in use:
[1, 2, 28, 3, 3, 33, 34, 37, 4, 40, 40, 41, 5, 6, 6, 7, 8, 9, 9, null, null, null, null, null, null, null, null, null, null]

  toytruck addresses:
[1, 10, 11, 12, 13, 14, 15, 16, 17, 19, 2, 20, 24, 27, 28, 29, 3, 30, 31, 33, 34, 35, 36, 37, 4, 40, 41, 42, 43, 44, 45, 46, 5, 6, 7, 8, 9]

  If the address is empty we set it to null
OK  If the address is clean we do nothing
  If the address is dirty but not in use, we just save it
  If the address is dirty and in use, we ask the user if they want to change one or change all
    If the user wants to change one, then we create a new address with the new value
      and don't touch the old one
    If the user want to change all, then we just save the model in question
  */


  }).export(module);
}());
