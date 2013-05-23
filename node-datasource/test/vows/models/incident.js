/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var XVOWS = XVOWS || {};
(function () {
  "use strict";

  var vows = require("vows"),
    assert = require("assert"),
    zombieAuth = require("../../mocha/lib/zombie_auth"),
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
    description: "Incident Updated"
  };

  vows.describe('XM.Incident CRUD test').addBatch({
    'We can INITIALIZE an Incident Model ': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.Incident();
            //account fetch
            var accntFetchOptions = {};
            accntFetchOptions.id = 'TTOYS';
            accntFetchOptions.success = function (resp) {
              //console.log("account fetch success");
              var cntctFetchOptions = {};
              cntctFetchOptions.id = '1';
              cntctFetchOptions.success = function (resp) {
                //console.log("contact fetch success");
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
      'Verify the record type is XM.Incident': function (error, data) {
        assert.isNull(error);
        assert.equal(data.model.recordType, "XM.Incident");
      }
    }
  }).addBatch({
    'We can CREATE an Incident Model ': crud.create(data, {
      '-> Set values to the Incident': {
        topic: function (data) {
          data.model.set('priority', XM.priorities.at(0));
          data.model.set('category', XM.incidentCategories.at(2));
          data.model.set('account', fetchedStuff.accnt);
          data.model.set('contact', fetchedStuff.cntct);
          data.model.set(data.createHash);
          return data;
        },
        'Verify Last Error is null': function (data) {
          assert.isNull(data.model.lastError);
        },
        '-> Save the Incident': crud.save(data)
      }
    })
  }).addBatch({
    'We can READ an Incident Model': {
      topic: function () {
        return data;
      },
      'Verify the Last Error is null': function (data) {
        assert.isNull(data.model.lastError);
      }
    }
  }).addBatch({
    'We can UPDATE an Incident Model ': crud.update(data, {
      '-> Set values to an Incident': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        '-> Commit to an Incident': crud.save(data)
      }
    })
  }).export(module);

}());
