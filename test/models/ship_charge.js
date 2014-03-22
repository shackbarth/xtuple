/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    data = {
      recordType : "XM.ShipCharge",
      autoTestAttributes : true,
      createHash : {
        name: "Test Ship Charge" + Math.random(),
        description: "iAmAShipCharge",
        isCustomerPay: true
      },
      updateHash : {
        name: "Update Test Ship Charge",
        isCustomerPay: false
      }
    };

  describe('XM.ShipCharge CRUD Test', function () {
    crud.runAllCrud(data);
  });
}());
