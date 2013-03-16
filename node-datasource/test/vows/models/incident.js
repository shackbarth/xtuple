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
    today = new Date(),
    fetchedStuff = {};

  data.createHash = {
    //account, contact: must be fetched
    //priority, category: set in create function (after initialization)
    description: "This is a very undescriptive description of an incident."
  };

  data.updateHash = {
    updated: today
  };

  vows.describe('XM.Incident CRUD test').addBatch({
    'INITIALIZE ': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.Incident();
            //account fetch
            var accntFetchOptions = {};
            accntFetchOptions.id = 1;
            accntFetchOptions.success = function (resp) {
              console.log("account fetch success");
              var cntctFetchOptions = {};
              cntctFetchOptions.id = 1;
              cntctFetchOptions.success = function (resp) {
                console.log("contact fetch success");
                that.callback(null, data);
              };
              cntctFetchOptions.error = function (resp) {
                that.callback("Could not fetch Contact.  Please use an actual Contact ID");
              };
              fetchedStuff.cntct.fetch(cntctFetchOptions);
            };
            accntFetchOptions.error = function (resp) {
              that.callback("Could not fetch Account.  Please use an actual Account ID.  Skipping contact fetch.");
            };
            fetchedStuff.accnt = new XM.AccountRelation();
            fetchedStuff.cntct = new XM.ContactRelation();
            fetchedStuff.accnt.fetch(accntFetchOptions);
          };
        zombieAuth.loadApp(callback);
      },
      'The record type is XM.Incident': function (error, data) {
        assert.isNull(error);
        assert.equal(data.model.recordType, "XM.Incident");
      }
    }
  }).addBatch({
    'CREATE ': crud.create(data, {
      '-> Set values': {
        topic: function (data) {
          data.model.set('priority', XM.priorities.at(0));
          data.model.set('category', XM.incidentCategories.at(2));
          data.model.set('account', fetchedStuff.accnt);
          data.model.set('contact', fetchedStuff.cntct);
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
      'Last Error is null': function (data) {
        assert.isNull(data.model.lastError);
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
    'DESTROY': crud.destroy(data)
  }).export(module);
  
}());
