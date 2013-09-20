/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    data = {
      recordType: "XM.Location",
      autoTestAttributes: false,
      createHash: {
        uuid: "NEWTEST" + Math.random(),
        site: {code: "WH1"},
        siteZone: {name: "RM1"},
        rack: "1",
        bin: "2",
        location: "2",
        items: {number: "YPAINT1"}
      },
      updateHash: {
        rack: "3"
      }
    };

  describe.skip('Location CRUD Test', function () {
    crud.runAllCrud(data);
  });
}());
