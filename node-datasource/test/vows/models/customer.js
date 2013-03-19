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
    name: "Test Cust",
    number: "MIKECUST",
    customerType: 19,
    terms: 42,
    //salesRep: must be fetched
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
    name: "Updated Test Customer"
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
          var that = this,
            fetchOptions = {},
            rep = new XM.SalesRep();
          fetchOptions.id = 30;
          fetchOptions.success = function () {
            data.model.set('salesRep', rep);
          };
          fetchOptions.error = function () {
            that.callback("Error fetching a SalesRep");
          };
          rep.fetch(fetchOptions);
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
          deleteData.accntId = data.model.get("account");
          deleteData.accountModel = new XM.Account();
          data.model.set(data.updateHash);
          return data;
        },
        'Name is `Updated Test Customer`': function (data) {
          assert.equal(data.model.get('name'), data.updateHash.name);
        },
        '-> Commit': crud.save(data)
      }
    })
  }).addBatch({
    'DESTROY': crud.destroy(data, {
      '-> Set values': {
        //Destroy the customer.  When that is successful, destroy the account
        'customer destroyed': function (data) {
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
