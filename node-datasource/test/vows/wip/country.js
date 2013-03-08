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
    name: "Outer Space",
    abbreviation: "OS",
    currencyAbbreviation: "USD"
  };

  data.updateHash = {
    abbreviation: "XY"
  };

  vows.describe('XM.Country CRUD test').addBatch({
    'INITIALIZE ': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.Country();
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'The record type is XM.Country': function (data) {
        assert.equal(data.model.recordType, "XM.Country");
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
      'Name is `Outer Space`': function (data) {
        assert.equal(data.model.get('name'), data.createHash.name);
      }
    }
  }).addBatch({
    'UPDATE ': crud.update(data, {
      '-> Set values': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        'Abbr is `XY`': function (data) {
          assert.equal(data.model.get('abbreviation'), data.updateHash.abbreviation);
        },
        '-> Commit': crud.save(data)
      }
    })
  }).addBatch({
    'DESTROY': crud.destroy(data)
  }).export(module);
  
}());
