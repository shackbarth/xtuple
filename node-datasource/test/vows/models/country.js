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
    name: "Sandwich Islands",
    abbreviation: "WQ",
    currencyAbbreviation: "USD"
  };

  data.updateHash = {
    abbreviation: "QQ"
  };

  vows.describe('XM.Country CRUD test').addBatch({
    'We can INITIALIZE a Country Model ': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.Country();
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'Verify the record type is XM.Country': function (data) {
        assert.equal(data.model.recordType, "XM.Country");
      }
    }
  }).addBatch({
    'We can CREATE a Country Model ': crud.create(data, {
      '-> Set values of the Country': {
        topic: function (data) {
          data.model.set(data.createHash);
          return data;
        },
        'Verify the Last Error is null': function (data) {
          assert.isNull(data.model.lastError);
        },
        '-> Save': crud.save(data)
      }
    })
  }).addBatch({
    'We can READ a Country Model': {
      topic: function () {
        return data;
      },
      'Verify Last Error is null': function (data) {
        assert.isNull(data.model.lastError);
      }
    }
  }).addBatch({
    'We can UPDATE a Country Model ': crud.update(data, {
      '-> Set values of the Country': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        '-> Commit a Country': crud.save(data)
      }
    })
  }).addBatch({
    'We can DESTROY a Country Model': crud.destroy(data)
  }).export(module);
  
}());
