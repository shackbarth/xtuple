/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var XVOWS = XVOWS || {};
(function () {
  "use strict";

  var vows = require("vows"),
    assert = require("assert"),
    crud = require('../lib/crud');

  var data = {
    recordType: "XM.Honorific",
    autoTestAttributes: true,
    createHash: {
      code: "Herr"
    },
    updateHash: {
      code: "Dame"
    }
  };

  vows.describe('XM.Honorific CRUD test').addBatch({
    'We can run the CRUD tests ': crud.runAllCrud(data)
  }).export(module);

}());
