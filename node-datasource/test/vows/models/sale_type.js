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
    id: 123456789,
    code: "TESTSALETYPE",
    description: "Test Sale Type"
  };

  data.updateHash = {
    description: "Changed Descrip"
  };

  vows.describe('XM.SaleType CRUD test').addBatch({
    'INITIALIZE ': {
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
    'CREATE ': crud.create(data, {
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
    'READ': {
      topic: function () {
        return data;
      },
      'ID is a number': function (data) {
        assert.isNumber(data.model.id);
      },
      'Code is `TESTSALETYPE`': function (data) {
        assert.equal(data.model.get('code'), data.createHash.code);
      },
      'Description is `Test Sale Type`': function (data) {
        assert.equal(data.model.get('description'), data.createHash.description);
      }
    }
  }).addBatch({
    'UPDATE ': crud.update(data, {
      '-> Set values': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        'Description is `Change Descrip`': function (data) {
          assert.equal(data.model.get('description'), data.updateHash.description);
        },
        '-> Commit': crud.save(data)
      }
    })
  }).addBatch({
    'DESTROY': crud.destroy(data)
  }).export(module);
  
}());
