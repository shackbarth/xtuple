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
    extra = {};

  data.createHash = {
    number: "MIKEPROSPECT",
    name: "Mike"
  };

  data.updateHash = {
    name: "Updated"
  };

  vows.describe('XM.Prospect CRUD test').addBatch({
    'INITIALIZE ': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.Prospect();
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'The record type is XM.Prospect': function (data) {
        assert.equal(data.model.recordType, "XM.Prospect");
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
        extra.accountId = data.model.get('account');
        return data;
      }
    }
  }).addBatch({
    'UPDATE ': crud.update(data, {
      '-> Set values': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        '-> Commit': crud.save(data)
      }
    })
  }).addBatch({
    'DESTROY': crud.destroy(data, {
      '-> Set values': {
        topic: function () {
          var that = this,
            fetchOptions = {},
            accountModel = new XM.Account();
            
          fetchOptions.id = extra.accountId;
          
          fetchOptions.success = function () {
            var destroyOptions = {};
            destroyOptions.success = function () {
              that.callback(null, data);
            };
            destroyOptions.error = function () {
              that.callback("Error destroying the newly created account.");
            };
            accountModel.destroy(destroyOptions);
          };
          fetchOptions.error = function () {
            that.callback("Error fetching the newly created account.");
          };
          accountModel.fetch(fetchOptions);
        }
      }
    })
  }).export(module);
  
}());
