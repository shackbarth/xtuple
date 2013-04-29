/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XM:true, XV:true, module:true, require:true, assert: true */

var XVOWS = XVOWS || {};
(function () {
  "use strict";

  var vows = require("vows"),
    assert = require("assert"),
    zombieAuth = require("../lib/zombie_auth"),
    crud = require('../lib/crud');

  var data = {};

  data.createHash = {
    code: "TESTSALE" + Math.random(),
    description: "Test Sale Type"
  };

  data.updateHash = {
    description: "Changed Descrip"
  };

  data.autoTestAttributes = true;

  vows.describe('XM.SaleType CRUD test').addBatch({
    'Initialize SaleType ': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.SaleType();
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'The record type is XM.SaleType': function (data) {
        assert.equal(data.model.recordType, "XM.SaleType");
      }
    }
  }).addBatch({
    'Create SaleType ': crud.create(data, {
      '-> Set values': {
        topic: function (data) {
          data.model.set(data.createHash);
          return data;
        },
        'Last Error is null': function (data) {
          assert.isNull(data.model.lastError);
        },
        '-> Save': crud.save(data)
      }
    })
  }).addBatch({
    'Read SaleType': {
      topic: function () {
        return data;
      },
      'ID is a string': function (data) {
        assert.isString(data.model.id);
      }
    }
  }).addBatch({
    'Update SaleType': crud.update(data, {
      '-> Set values': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        '-> Commit': crud.save(data)
      }
    })
  }).addBatch({
    'Destroy SaleType': crud.destroy(data)
  }).export(module);

}());
