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
      recordType : "XM.Currency",
      autoTestAttributes : true,
      createHash : {
        name: 'rupee',
        symbol: 'R',
        abbreviation: 'RUP'
      },
      updateHash : {
        name : 'Rupayi'
      }
    };
  vows.describe('XM.Currency CRUD test').addBatch({
    'We can run the XM.Currency CRUD tests ': crud.runAllCrud(data)
  }).export(module);
}());