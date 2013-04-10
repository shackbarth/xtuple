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

  var data = {},
    deleteData = {};

  data.createHash = {
    code: "TESTTAXAUTH",
    name: "Thom Yorke"
  };

  data.updateHash = {
    name: "Jon Fishman"
  };

  vows.describe('XM.TaxAuthority CRUD test').addBatch({
    'INITIALIZE ': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.TaxAuthority();
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'The record type is XM.TaxAuthority': function (data) {
        assert.equal(data.model.recordType, "XM.TaxAuthority");
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
      }
    }
  }).addBatch({
    'UPDATE ': crud.update(data, {
      '-> Set values': {
        topic: function () {
          deleteData.accntId = data.model.get("account").get("id");
          deleteData.accountModel = new XM.Account();
          data.model.set(data.updateHash);
          return data;
        },
        'Name is `Updated Test TaxAuthority`': function (data) {
          assert.equal(data.model.get('name'), data.updateHash.name);
        },
        '-> Commit': crud.save(data)
      }
    })
  }).addBatch({
    'DESTROY': crud.destroy(data, {
      '-> Set values': {
        //Destroy the tax authority.  When that is successful, destroy the account
        'tax authority destroyed': function (data) {
          assert.isTrue(data.model.getStatus() === XM.Model.DESTROYED_CLEAN);
        },
        topic: function () {
          var that = this,
            fetchOptionsAccnt = {};
        
          fetchOptionsAccnt.id = deleteData.accntId;
        
          fetchOptionsAccnt.success = function () {
            var destroyOptionsAccnt = {};
            destroyOptionsAccnt.success = function () {
              that.callback(null, data);
            };
            deleteData.accountModel.destroy(destroyOptionsAccnt);
          };
          deleteData.accountModel.fetch(fetchOptionsAccnt);
        }
      }
    })
  }).export(module);
  
}());
