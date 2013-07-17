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
            var prefSite = XM.sites.get('WH1');
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
          fetchOptions.id = 'JSMITH';
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
      'ID is a string': function (data) {
        assert.isString(data.model.id);
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
      '-> Destroy the Customer': {
        //Destroy the customer.  When that is successful, destroy the account
        'Customer destroyed': function (data) {
          assert.equal(data.model.getStatusString(), 'DESTROYED_CLEAN');
        },
        '-> Destroy the Account': {
          topic: function () {
            var that = this,
              account = deleteData.accountModel,
              fetchOptionsAccnt = {},
              destroyAccount;

            fetchOptionsAccnt.id = deleteData.accntId;

            destroyAccount = function () {
              if (account.getStatus() === XM.Model.READY_CLEAN) {
                var accountDestroyed = function () {
                    if (account.getStatus() === XM.Model.DESTROYED_CLEAN) {
                      account.off("statusChange", accountDestroyed);
                      that.callback(null, account);
                    }
                  };

                account.off("statusChange", destroyAccount);
                account.on("statusChange", accountDestroyed);
                account.destroy();
              }
            };
            account.on("statusChange", destroyAccount);
            account.fetch(fetchOptionsAccnt);
          },
          'Account destroyed': function (account) {
            assert.equal(account.getStatusString(), 'DESTROYED_CLEAN');
          }
        }
      }
    })
  }).export(module);
  
}());
