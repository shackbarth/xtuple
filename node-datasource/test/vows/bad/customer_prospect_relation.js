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

  var data = {};

  data.createHash = {
    number: "TESTCUSTPROSP",
    name: "A test CustomerProspectRelation"
  };

  data.updateHash = {
    number: "UPDATECUSTPROSP"
  };

  vows.describe('XM.CustomerProspectRelation CRUD test').addBatch({
    'We can INITIALIZE a CustomerProspectRelation Model': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.CustomerProspectRelation();
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'The record type is XM.CustomerProspectRelation': function (data) {
        assert.equal(data.model.recordType, "XM.CustomerProspectRelation");
      }
    }
  }).addBatch({
    'We can FETCH a CustomerProspectRelation Model with a customer': {
      topic: function () {
        var fetchOptions = {},
          that = this;
        fetchOptions.id = 97;
        fetchOptions.success = function () {
          that.callback(null, data);
        };
        fetchOptions.error = function () {
          that.callback("Error fetching the relation.  Please use an actual CustomerID");
        };
        data.model.fetch(fetchOptions);
      },
      'Verify the Last Error is null': function (data) {
        assert.isNull(data.model.lastError);
      }
    }
  }).addBatch({
    'We can FETCH a CustomerProspectRelation Model with a prospect': {
      topic: function () {
        var fetchOptions = {},
          that = this;
        fetchOptions.id = 98;
        data.model = new XM.CustomerProspectRelation();
        fetchOptions.success = function () {
          that.callback(null, data);
        };
        fetchOptions.error = function () {
          that.callback("Error fetching the relation.  Please use an actual Prospect ID");
        };
        data.model.fetch(fetchOptions);
      },
      'Verify the Last Error is null': function (data) {
        assert.isNull(data.model.lastError);
      }
    }
  }).addBatch({
    'We can READ an Account Model': {
      topic: function () {
        return data;
      },
      'Make sure the model attributes are not null/undefined': function (data) {
        assert.isNotNull(data.model.get('id'));
        assert.notEqual(data.model.get('id'), undefined);
      },
      'Verify the Last Error is null': function (data) {
        assert.isNull(data.model.lastError);
      }
    }
  }).export(module);
  
}());
