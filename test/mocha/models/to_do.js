/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    data = {
      recordType: "XM.ToDo",
      autoTestAttributes: true,
      createHash: {
        name: "Pass the VOWS tests" + Math.random(),
        dueDate: new Date()
      },
      updateHash: {
        name: "Updated"
      }
    };

  describe('ToDo CRUD Test', function () {
    crud.runAllCrud(data);
  });
}());
