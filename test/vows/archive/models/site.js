/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var XVOWS = XVOWS || {};
(function () {
  "use strict";

  var vows = require("vows"),
    crud = require('../lib/crud'),
    data = {
      recordType: "XM.Site",
      autoTestAttributes: true,
      createHash: {
        code: "B2E2",
        description: "Between Egypt and Eritrea",
        siteType: {id: 2}
      },
      updateHash: {
        description: "Between England and Eire, PA"
      }
    };

  // Site will not be working until the patch to the database code is in place
  //vows.describe('XM.Site CRUD test').addBatch({
  //  'We can run the XM.Site CRUD tests ': crud.runAllCrud(data)
  //}).export(module);

}());
