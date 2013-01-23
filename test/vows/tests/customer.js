/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XVOWS:true, XT:true, XM:true, _:true, setTimeout:true,
  clearTimeout:true, vows:true, module:true, assert:true, console:true */

(function () {
  "use strict";

  var createHash,
    updateHash,
    model = new XM.Customer();

  createHash = {
    name: "TESTCUSTOMER",
    number: "HELLO",
    customerType: 19,
    terms: 42,
    salesRep: 29,
    backorder: true,
    partialShip: true,
    discount: 0,
    balanceMethod: "B",
    isFreeFormShipto: true,
    blanketPos: false,
    shipCharge: 4,
    creditStatus: "G",
    isFreeFormBillto: false,
    usesPos: false,
    autoUpdateStatus: false,
    autoHoldOrders: false,
    preferredWarehouseId: 35
  };

  updateHash = {
    name: "UPDATETESTCUSTOMER"
  };

  vows.describe('XM.Customer CRUD test').addBatch({
    'CREATE ': XVOWS.create(model, {
      '-> Set values': {
        topic: function (model) {
          model.set(createHash);
          return model;
        },
        'Last Error is null': function (model) {
          assert.isNull(model.lastError);
        },
        '-> Save': XVOWS.save(model)
      }
    })
  }).addBatch({
    'READ': {
      topic: function () {
        return model;
      },
      'Name is `TESTCUSTOMER`': function (model) {
        assert.equal(model.get('name'), createHash.name);
      }
    }
  }).addBatch({
    'UPDATE ': XVOWS.update(model, {
      '-> Set values': {
        topic: function () {
          model.set(updateHash);
          return model;
        },
        'Name is `UPDATECUSTOMER`': function (model) {
          assert.equal(model.get('name'), updateHash.name);
        },
        '-> Commit': XVOWS.save(model)
      }
    })
  }).addBatch({
    'DESTROY': XVOWS.destroy(model, {
      'FINISH XM.Customer': function () {
        XVOWS.next();
      }
    })
  }).run();
}());
