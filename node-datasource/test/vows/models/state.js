/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var XVOWS = XVOWS || {};
(function () {
  "use strict";

  var vows = require("vows"),
    crud = require('../lib/crud');

  var data = {
    recordType: "XM.State",
    autoTestAttributes: true,
    createHash: {
      name: "Milky Way",
      abbreviation: "MW",
      country: 214  //arbitrary number, must match actual country_id
    },
    updateHash: {
      abbreviation: "XY"
    }
  };

  vows.describe('XM.State CRUD test').addBatch({
    'We can run the State CRUD tests ': crud.runAllCrud(data)
  }).export(module);

}());
