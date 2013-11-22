/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    data = {
      recordType : "XM.SiteType",
      autoTestAttributes : true,
      createHash: {
        name: "FUDGE" + Math.random(),
        description: "A site specializing in fudge"
      },
      updateHash: {
        description: "A site with an exclusive fudge partnership with L.A. Burdick, Inc."
      }
    };

  describe('SiteType CRUD Test', function () {
    crud.runAllCrud(data);
  });
}());
