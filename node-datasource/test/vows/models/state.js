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
    name: "Milky Way",
    abbreviation: "MW",
    country: 214  //arbitrary number, must match actual country_id
  };

  data.updateHash = {
    abbreviation: "XY"
  };

  vows.describe('XM.State CRUD test').addBatch({
    'We can INITIALIZE a State Model ': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.State();
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'Verify the record type is XM.State': function (data) {
        assert.equal(data.model.recordType, "XM.State");
      }
    }
  }).addBatch({
    'We can CREATE a State Model ': crud.create(data, {
      '-> Set values': {
        topic: function (data) {
          data.model.set(data.createHash);
          return data;
        },
        'Verify the Last Error is null': function (data) {
          assert.isNull(data.model.lastError);
        },
        '-> Save the State': crud.save(data)
      }
    })
  }).addBatch({
    'We can READ a State Model': {
      topic: function () {
        return data;
      },
      'State ID is a number': function (data) {
        assert.isNumber(data.model.id);
      },
      'State Name is `Milky Way`': function (data) {
        assert.equal(data.model.get('name'), data.createHash.name);
      }
    }
  }).addBatch({
    'We can UPDATE a State Model ': crud.update(data, {
      '-> Set values to a State': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        'Verify the State Abbr is `XY`': function (data) {
          assert.equal(data.model.get('abbreviation'), data.updateHash.abbreviation);
        },
        '-> Commit the State': crud.save(data)
      }
    })
  }).addBatch({
    'We can DESTROY a State Model': crud.destroy(data)
  }).export(module);
  
}());
