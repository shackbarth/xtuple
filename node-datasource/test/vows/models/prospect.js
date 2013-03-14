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
        /*I need to fetch the newly created account here.
         I would do it in the destroy batch, but when the
         prospect is destroyed, the prospect ID is stripped
         from the crmacct.  Also need to fetch ProspectRelation for this to work.
        */
        var that = this,
          fetchOptions,
          fetchOptions2,
          prospRel = new XM.ProspectRelation();
        extra.accountModel = new XM.Account();
        fetchOptions.prospect = data.model.get('id');  //this doesn't work because accountModel.prospect is a ProspectRelation, not an id
        extra.canDelete = false;
        fetchOptions.success = function () {
          extra.canDelete = true;
        };
        fetchOptions.error = function () {
          that.callback("Could not fetch the matching account.");
        };
        extra.accountModel.fetch(fetchOptions);
        return data;
      }
    }
  }).addBatch({
    'UPDATE ': crud.update(data, {
      '-> Set values': {
        topic: function () {
          data.model.set(data.updateHash);
          extra.id = data.model.get('id');
          return data;
        },
        '-> Commit': crud.save(data)
      }
    })
  }).addBatch({
    'DESTROY': crud.destroy(data, {
      '-> Set values': {
        //Destroy the prospect.  Make sure that wass successful, then destroy the account
        'prospect destroyed': function (data) {
          assert.isTrue(data.model.getStatus() === XM.Model.DESTROYED_CLEAN);
        },
        topic: function () {
          var that = this,
            destroyOptions = {};
          if (!extra.canDelete) {
            that.callback("Cannot delete the account because the fetch was unsuccessful.");
          }
          destroyOptions.success = function () {
            that.callback(null);
          };
          destroyOptions.error = function () {
            that.callback("Was able to fetch the newly created account, but destroy was unsuccessful.");
          };
          extra.accountModel.destroy();
        }
      }
    })
  }).export(module);
  
}());
