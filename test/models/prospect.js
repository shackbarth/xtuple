/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    data = {
      recordType: "XM.Prospect",
      autoTestAttributes: true,
      createHash : {
        number: "TESTPROSPECT" + Math.random(),
        name: "TestRep"
      },
      updateHash : {
        name: "Updated Test Prospect"
      },
      beforeDeleteActions: crud.accountBeforeDeleteActions,
      afterDeleteActions: crud.accountAfterDeleteActions
    };

  describe('Prospect CRUD Test', function () {
    crud.runAllCrud(data);
  });
}());
