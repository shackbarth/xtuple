/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XVOWS:true, XT:true, XM:true, _:true, setTimeout:true,
  clearTimeout:true, vows:true, module:true, assert:true, console:true */

(function () {
  "use strict";

  var createHash,
    updateHash,
    model = new XM.ShipCharge();

  createHash = {
    name: "TESTSHIPCHARGE",
    description: "iAmAShipCharge",
    isCustomerPay: true
  };

  updateHash = {
    name: "UPDATETESTSHIPCHARGE",
    isCustomerPay: false
  };

  vows.describe('XM.ShipCharge CRUD test').addBatch({
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
      'ID is a number': function (model) {
        assert.isNumber(model.id);
      },
      'Name is `TESTSHIPCHARGE`': function (model) {
        assert.equal(model.get('name'), createHash.name);
      },
      'Description is `iAmAShipCharge`': function (model) {
        assert.equal(model.get('description'), createHash.description);
      },
      'isCustomerPay is true': function (model) {
        assert.equal(model.get('isCustomerPay'), createHash.isCustomerPay);
      }
    }
  }).addBatch({
    'UPDATE ': XVOWS.update(model, {
      '-> Set values': {
        topic: function () {
          model.set(updateHash);
          return model;
        },
        'Name is `UPDATETESTSHIPCHARGE`': function (model) {
          assert.equal(model.get('name'), updateHash.name);
        },
        'isCustomerPay is false': function (model) {
          assert.equal(model.get('isCustomerPay'), updateHash.isCustomerPay);
        },
        '-> Commit': XVOWS.save(model)
      }
    })
  }).addBatch({
    'DESTROY': XVOWS.destroy(model, {
      'FINISH XM.ShipCharge': function () {
        XVOWS.next();
      }
    })
  }).run();
}());
