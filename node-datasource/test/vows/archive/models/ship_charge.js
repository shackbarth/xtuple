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
    name: "Test Ship Charge",
    description: "iAmAShipCharge",
    isCustomerPay: true
  };

  data.updateHash = {
    name: "Update Test Ship Charge",
    isCustomerPay: false
  };

  vows.describe('XM.ShipCharge CRUD test').addBatch({
    'We can INITIALIZE a ShipCharge Model': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.ShipCharge();
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'Verify the record type is XM.ShipCharge': function (data) {
        assert.equal(data.model.recordType, "XM.ShipCharge");
      }
    }
  }).addBatch({
    'We can CREATE a ShipCharge Model ': crud.create(data, {
      '-> Set values to a Ship Charge': {
        topic: function (data) {
          data.model.set(data.createHash);
          return data;
        },
        'Verify the Last Error is null': function (data) {
          assert.isNull(data.model.lastError);
        },
        '-> Save the Ship Charge': crud.save(data)
      }
    })
  }).addBatch({
    'We can READ a Ship Charge Model': {
      topic: function () {
        return data;
      },
      'Verify the Last Error is null': function (data) {
        assert.isNull(data.model.lastError);
      }
    }
  }).addBatch({
    'We can UPDATE a Ship Charge Model ': crud.update(data, {
      '-> Set valuesto a Ship Charge': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        '-> Commit to a Ship Charge': crud.save(data)
      }
    })
  }).addBatch({
    'We can DESTROY a Ship Charge Model': crud.destroy(data)
  }).export(module);
  
}());
