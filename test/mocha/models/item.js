/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    data = {
      recordType: "XM.Item",
      autoTestAttributes: true,
      createHash: {
        number: "NEWTEST" + Math.random(),
        description1: "Item description1",
        isActive: true,
        itemType: "P",
        classCode: {code: "TOYS-COMP"},
        productCategory: {code: "CLASSIC-WOOD"},
        inventoryUnit: {name: "CS"},
        isFractional: true,
        isSold: true,
        listPrice: 0.00,
        priceUnit: {name: "CS"}
      },
      updateHash: {
        description1: "A new description of an item"
      }
    };

  describe.skip('Item CRUD Test', function () {
    crud.runAllCrud(data);
  });
}());
