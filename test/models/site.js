/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    data = {
      recordType: "XM.Site",
      autoTestAttributes: true,
      createHash: {
        code: "B2E2" + Math.random(),
        description: "Between Egypt and Eritrea",
        siteType: {name: "DIST"}
      },
      updateHash: {
        description: "Between England and Eire, PA"
      }
    };

  describe('Site CRUD Test', function () {
    crud.runAllCrud(data);
  });
}());
