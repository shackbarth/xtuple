/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var XVOWS = XVOWS || {};
(function () {
  "use strict";
  var vows = require("vows"),
    crud = require("../lib/crud.js"),
    data = {
    recordType : "XM.ClassCode",
    autoTestAttributes : true,
    createHash : {
      code: 'test code',
      description: 'code description'
    },
    updateHash : {
      description : 'update description'
    }
  };
  vows.describe('XM.Class Code CRUD test').addBatch({
    'We can run the XM.Class Code CRUD tests ': crud.runAllCrud(data)
  }).export(module);
}());