/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var XVOWS = XVOWS || {};
(function () {
  "use strict";

  var vows = require("vows"),
    assert = require("assert"),
    zombieAuth = require("../lib/zombie_auth"),
    crud = require('../lib/crud');

  var data = {
    recordType: "XM.Address",
    autoTestAttributes: true,
    createHash: {
      line1: "123 Main St"
    },
    updateHash: {
      line1: "456 Main St"
    }
  };

  vows.describe('XM.Address CRUD test').addBatch({
    'We can run the XM.Address CRUD tests ': crud.runAllCrud(data)
  }).export(module);
}());
