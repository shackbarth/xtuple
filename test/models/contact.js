/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true, module:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    data = {
      recordType: "XM.Contact",
      commentType: "XM.ContactComment",
      autoTestAttributes: true,
      testComments: true,
      createHash: require("../lib/model_data").contact,
      updateHash: {
        firstName: "Mike"
      }
    };

  describe('Contact CRUD Test', function () {
    crud.runAllCrud(data);
  });
}());
