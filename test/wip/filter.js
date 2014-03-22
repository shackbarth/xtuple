/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    data = {
      recordType : "XM.Filter",
      autoTestAttributes : true,
      enforceUpperKey: false,
      createHash : {
        name: 'Filter Name',
        createdBy: 'username',
        params: '{search: search}',
        kind: 'XM.SomeParameterKind'
      },
      updateHash : {
        name: 'New Filter Name',
        shared: true
      }
    };

  describe('Filter CRUD Test', function () {
    crud.runAllCrud(data);
  });
}());
