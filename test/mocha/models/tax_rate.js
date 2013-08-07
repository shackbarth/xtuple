/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    data = {
      recordType: "XM.TaxRate",
      autoTestAttributes: true,
      createHash: {
        amount: 10,
        percent: 5,
        effectiveDate: new Date(),
        expirationDate: new Date(),
        tax: {code: 'VATAX-A'},
        currency: {abbreviation: 'USD'}
      },
      updateHash: {
        amount: 20
      }
    };

  describe('Tax rate CRUD Test', function () {
    crud.runAllCrud(data);
  });
}());
