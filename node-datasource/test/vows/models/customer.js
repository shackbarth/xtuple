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
    name: "Test Customer",
    number: "TESTCUSTOMER",
    customerType: 19,
    terms: 42,
    salesRep: 29,
    backorder: true,
    partialShip: true,
    discount: 0,
    balanceMethod: "B",
    isFreeFormShipto: true,
    blanketPurchaseOrders: false,
    shipCharge: 4,
    creditStatus: "G",
    isFreeFormBillto: false,
    usesPurchaseOrders: false,
    autoUpdateStatus: false,
    autoHoldOrders: false
  };

  data.updateHash = {
    number: "UPDATETESTCUSTOMER"
  };

  vows.describe('XM.Customer CRUD test').addBatch({
    'INITIALIZE ': {
      topic: function () {
        var that = this,
          callback = function () {
            var prefSite = XM.sites.get(35);
            data.createHash.preferredSite = prefSite; //this has to be set here because XM.sites hasn't loaded yet
            data.model = new XM.Customer();
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'The record type is XM.Customer': function (data) {
        assert.equal(data.model.recordType, "XM.Customer");
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
      },
      'Number is `TESTCUSTOMER`': function (data) {
        assert.equal(data.model.get('number'), data.createHash.number);
      }
    }
  }).addBatch({
    'UPDATE ': crud.update(data, {
      '-> Set values': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        'Number is `UPDATETESTCUSTOMER`': function (data) {
          assert.equal(data.model.get('number'), data.updateHash.number);
        },
        '-> Commit': crud.save(data)
      }
    })
  }).addBatch({
    'DESTROY': crud.destroy(data)
  }).export(module);
  
}());
