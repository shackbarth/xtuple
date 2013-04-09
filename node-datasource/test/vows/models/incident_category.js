(function () {
 "use strict";
  var vows = require("vows"),
    assert = require("assert"),
    _ = require("underscore"),
    zombieAuth = require("../lib/zombie_auth.js"),
    crud = require("../lib/crud.js");
  var data = { 
  recordType : "XM.IncidentCategory",
  autoTestAttributes : true,
  createHash : {
    name: 'tested',
    description: 'description'
  },
  updateHash : {
    description : 'Update Description'
  }
  };
   vows.describe('XM.IncidentCategory CRUD test').addBatch({
    'We can run the XM.IncidentCategory CRUD tests ': crud.runAllCrud(data)
  }).export(module);
}());