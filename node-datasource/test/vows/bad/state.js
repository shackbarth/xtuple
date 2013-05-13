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
      recordType: "XM.State",
      autoTestAttributes: true,
      createHash: {
        name: "Milky Way",
        abbreviation: "MW",
        country: 'AU' //arbitrary number, must match actual country_id
      },
      updateHash: {
        name: "Zone"
      }
    };

  vows.describe('XM.State CRUD test').addBatch({
    'We can run the XM.State CRUD tests ': crud.runAllCrud(data)
  }).export(module);

}());
