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
    calculateFreight: false,
    quoteDate: new Date(),
    salesRep: 29,
    terms: 42
  };

  data.updateHash = {
    terms: 43
  };

  vows.describe('XM.Quote CRUD test').addBatch({
    'INITIALIZE ': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.Quote();
            //need to create and fetch a CustomerProspectRelation
            data.model.custProspRel = new XM.CustomerProspectRelation();
            var fetchOptions = {};
            fetchOptions.id = 97; //must be an actual customer or prospect ID
            fetchOptions.success = function (resp) {
              data.model.set('customer', data.model.custProspRel);
            };
            fetchOptions.error = function (resp) {
              assert.isFalse('Customer/Prospect Relation fetch failed.  Please use an actual cust/prosp ID');
            };
            data.model.custProspRel.fetch(fetchOptions);
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'The record type is XM.Quote': function (data) {
        assert.equal(data.model.recordType, "XM.Quote");
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
