(function () {
 "use strict";
  var vows = require("vows"),
    assert = require("assert"),
    _ = require("underscore"),
    zombieAuth = require("../lib/zombie_auth.js"),
    crud = require("../lib/crud.js");
  var data = { 
  recordType : "XM.IncidentSeverity",
  autoTestAttributes : true,
  createHash : {
    name: 'Top',
    description: 'Top'
  },
  updateHash : {
    description : 'Update Description'
  }
  };
   vows.describe('XM.IncidentSeverity CRUD test').addBatch({
    'We can run the XM.IncidentSeverity CRUD tests ': crud.runAllCrud(data)
  }).export(module);
}());