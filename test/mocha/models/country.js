/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true, module:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    data = {
      recordType : "XM.Country",
      autoTestAttributes : true,
      enforceUpperKey: true,
      createHash: {
        name: "DQ Islands" + Math.random(),
        abbreviation: "DQ",
        currencyAbbreviation: "USD"
      },
      updateHash: {
        abbreviation: "qq"
      }
    };

  describe('Country CRUD Test', function () {
    this.timeout(20 * 1000);
    it('should perform all the crud operations', function (done) {
      crud.runAllCrud(data, done);
    });
  });
}());
