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
    line1: "123 Main St"
  };

  data.updateHash = {
    line1: "456 Main St"
  };

  vows.describe('XM.Address CRUD test').addBatch({
    'We can INITIALIZE an Address Model': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.Address();
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'Verify the record type is XM.Address': function (data) {
        assert.equal(data.model.recordType, "XM.Address");
      }
    }
  }).addBatch({
    'We can CREATE an Address Model': crud.create(data, {
      '-> Set values to the Address': {
        topic: function (data) {
          data.model.set(data.createHash);
          return data;
        },
        'Verify the Last Error is null': function (data) {
          assert.isNull(data.model.lastError);
        },
        '-> Save Address': crud.save(data)
      }
    })
  }).addBatch({
    'We can READ the Address Model': {
      topic: function () {
        return data;
      },
      'Verify the Last Error is null': function (data) {
        assert.isNull(data.model.lastError);
      }
    }
  }).addBatch({
    'We can UPDATE the Address Model ': crud.update(data, {
      '-> Set values to the Address': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        '-> Commit Address': crud.save(data)
      }
    })
  }).addBatch({
    'We can DESTROY an Address Model': crud.destroy(data)
  }).export(module);
  
}());
