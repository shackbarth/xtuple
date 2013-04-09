/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var XVOWS = XVOWS || {};
(function () {
  "use strict";
  var vows = require("vows"),
    assert = require("assert"),
    _ = require("underscore"),
    zombieAuth = require("../lib/zombie_auth.js"),
    crud = require("../lib/crud.js"),
    data = {
    recordType : "XM.Unit",
    autoTestAttributes : true,
    createHash : {
      name : 'IN',
      description : 'Inch'
    },
    updateHash : {
      description : 'Inch Description'
    }
  };
  vows.describe('XM.Unit CRUD test').addBatch({
    'We can run the XM.Unit CRUD tests ': crud.runAllCrud(data)
  }).export(module);
}());