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
    code: "TESTSHIPVIA",
    description: "Test Ship Via"
  };

  data.updateHash = {
    code: "UPDATETESTSHIPVIA"
  };

  vows.describe('XM.ShipVia CRUD test').addBatch({
    'We can INITIALIZE a Ship Via Model ': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.ShipVia();
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'Verify the record type is XM.ShipVia': function (data) {
        assert.equal(data.model.recordType, "XM.ShipVia");
      }
    }
  }).addBatch({
    'We can CREATE a Ship Via Model ': crud.create(data, {
      '-> Set values to Ship Via': {
        topic: function (data) {
          data.model.set(data.createHash);
          return data;
        },
        'Verify the Last Error is null': function (data) {
          assert.isNull(data.model.lastError);
        },
        '-> Save the Ship Via': crud.save(data)
      }
    })
  }).addBatch({
    'We can READ a Ship Via Model': {
      topic: function () {
        return data;
      },
      'Ship Via ID is a string': function (data) {
        assert.isString(data.model.id);
      },
      'Ship Via Code is `TESTSHIPVIA`': function (data) {
        assert.equal(data.model.get('code'), data.createHash.code);
      },
      'Ship Via Description is `Test Ship Via`': function (data) {
        assert.equal(data.model.get('description'), data.createHash.description);
      }
    }
  }).addBatch({
    'We can UPDATE a Ship Via Model ': crud.update(data, {
      '-> Set values to a Ship Via': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        'Ship Via Code is `UPDATETESTSHIPVIA`': function (data) {
          assert.equal(data.model.get('code'), data.updateHash.code);
        },
        '-> Commit a Ship Via': crud.save(data)
      }
    })
  }).addBatch({
    'We can DESTROY a Ship Via Model': crud.destroy(data)
  }).export(module);
  
}());
