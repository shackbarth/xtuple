/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    data = {
      recordType: "XM.Customer",
      autoTestAttributes: true,
      createHash : {
        number: "TESTCUSTOMER" + Math.random(),
        name: "TestCust",
        customerType: { code: "NORMAL" },
        salesRep: { number: "JSMITH" },
        shipCharge: { name: "ADDCHARGE" },
        terms: { code: "2-10N30" }
      },
      updateHash : {
        name: "Updated Test Cust"
      },
      beforeDeleteActions: crud.accountBeforeDeleteActions,
      afterDeleteActions: crud.accountAfterDeleteActions
    };

  describe('Customer CRUD Test', function () {
    crud.runAllCrud(data);
  });
}());
