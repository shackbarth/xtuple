/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    data = {
      recordType: "XM.TaxClass",
      autoTestAttributes: true,
      createHash: {
        code: "TC Code" + Math.random(),
        description: "Tax Class Code",
        sequence: 998
      },
      updateHash: {
        description: "updated descrip"
      }
    };

  describe('Tax Class CRUD Test', function () {
    crud.runAllCrud(data);
  });
}());
