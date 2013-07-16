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
    name: "TESTSHIPZONE",
    description: "Test Ship Zone"
  };

  data.updateHash = {
    name: "UPDATETESTSHIPZONE"
  };

  vows.describe('XM.ShipZone CRUD test').addBatch({
    'We can INITIALIZE a Ship Zone Model': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.ShipZone();
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'Verify the record type is XM.ShipZone': function (data) {
        assert.equal(data.model.recordType, "XM.ShipZone");
      }
    }
  }).addBatch({
    'We can CREATE a Ship Zone Model ': crud.create(data, {
      '-> Set values to the Ship Zone': {
        topic: function (data) {
          data.model.set(data.createHash);
          return data;
        },
        'Verify the Last Error is null': function (data) {
          assert.isNull(data.model.lastError);
        },
        '-> Save the Ship Zone': crud.save(data)
      }
    })
  }).addBatch({
    'We can READ a Ship Zone Model': {
      topic: function () {
        return data;
      },
      'Verify the Ship Zone ID is a string': function (data) {
        assert.isString(data.model.id);
      },
      'Verify the Ship Zone Name is `TESTSHIPZONE`': function (data) {
        assert.equal(data.model.get('name'), data.createHash.name);
      },
      'Verify the Ship Zone Description is `Test Ship Zone`': function (data) {
        assert.equal(data.model.get('description'), data.createHash.description);
      }
    }
  }).addBatch({
    'We can UPDATE a Ship Zone Model': crud.update(data, {
      '-> Set values to Ship Zone': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        'Verify the Ship Zone Name is `UPDATETESTSHIPZONE`': function (data) {
          assert.equal(data.model.get('name'), data.updateHash.name);
        },
        '-> Commit the Ship Zone': crud.save(data)
      }
    })
  }).addBatch({
    'We can DESTROY a Ship Zone Model': crud.destroy(data)
  }).export(module);
  
}());
