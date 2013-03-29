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

  }).addBatch({
    // Business-logic specific tests to be run outside of crud
    'We can take a model that is in use somewhere else': {
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
      'we do get them all back': function (error, topic) {
        assert.isNull(error);
        assert.equal(topic.get("line1"), "Ungargasse 60 ");
      }
    }

  }).export(module);
}());
