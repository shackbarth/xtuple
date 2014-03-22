/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
      data = {
      recordType: "XM.UserAccount",
      autoTestAttributes: true,
      createHash: {
        username: 'uname1',
        password: 'second',
        passwordCheck: 'second',
        properName: 'Peter',
        isActive: true,
        locale: 'Default'
      },
      updateHash: {
        properName : 'Parker'
      }
    };

  describe('User Account CRUD Test', function () {
    crud.runAllCrud(data);
  });
}());
