/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true, module:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    data = {
      recordType: "XM.ItemGroup",
      autoTestAttributes: true,
      enforceUpperKey: false,
      createHash: {
        name: "Test item group" + Math.random(),
        description: "test item group description",
        items: { number: "YTRUCK1" }
      },
      updateHash: {
        name: "Update test item group" + Math.random()
      }
    };

  describe.skip('Item Group CRUD Test', function () {
    crud.runAllCrud(data);
  });
}());
