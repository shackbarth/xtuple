/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true, describe:true, it:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    data = {
      recordType: "XM.Address",
      autoTestAttributes: true,
      createHash: {
        line1: "123 Main St"
      },
      updateHash: {
        line1: "456 Main St"
      }
    };

  describe('Address CRUD Test', function () {
    crud.runAllCrud(data);
  });
}());
