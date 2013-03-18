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
    number: "test account",
    name: "A test Account"
  };

  data.updateHash = {
    number: "updated account"
  };

  vows.describe('XM.Account CRUD test').addBatch({
    'We can INITIALIZE an Account Model': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.Account();
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'The record type is XM.Account': function (data) {
        assert.equal(data.model.recordType, "XM.Account");
      }
    }
  }).addBatch({
    'We can CREATE an Account Model': crud.create(data, {
      '-> Set values': {
        topic: function (data) {
          data.model.set(data.createHash);
          return data;
        },
        'Verify the Last Error is null': function (data) {
          assert.isNull(data.model.lastError);
        },
        '-> Save Account': crud.save(data)
      }
    })
  }).addBatch({
    'We can READ an Account Model': {
      topic: function () {
        return data;
      },
      'Verify the Last Error is null': function (data) {
        assert.isNull(data.model.lastError);
      }
    }
  }).addBatch({
    'We can UPDATE an Account Model': crud.update(data, {
      '-> Set values': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        '-> Commit Account': crud.save(data)
      }
    })
  }).addBatch({
    'We can DESTROY an Account Model': crud.destroy(data)
  }).export(module);
  
}());
