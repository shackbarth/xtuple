/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var assert = require("chai").assert,
    crud = require('../lib/crud'),
    data = {
      recordType : "XM.SalesCategory",
      autoTestAttributes : true,
      createHash : {
        name: "NORMAL-SALE-" + Math.random(),
        description: "Normal Sale",
        isActive: true
      },
      updateHash : {
        description: "Changed Descrip"
      }
    };

  describe('SalesCategory CRUD Test', function () {
    crud.runAllCrud(data);
  });
})();
