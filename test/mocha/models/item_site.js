/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    data = {
      verbose: true,
      recordType: "XM.ItemSite",
      autoTestAttributes: true,
      createHash: {
        uuid: "NEWTEST" + Math.random(),
        item: {number: "CBODY1"},
        site: {code: "ST1"},
        isActive: true,
        plannerCode: {code: "MRP"},
        costCategory: {code: "MATERIALS"},
        controlMethod: "R",
        costMethod: "S",
        notes: ""
      },
      updateHash: {
        notes: "test notes"
      }
    };

  describe.skip('Item Site CRUD Test', function () {
    crud.runAllCrud(data);
  });
}());
