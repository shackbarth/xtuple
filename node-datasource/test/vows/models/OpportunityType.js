(function () {
 "use strict";
  var vows = require("vows"),
    assert = require("assert"),
    _ = require("underscore"),
    zombieAuth = require("../lib/zombie_auth.js"),
    crud = require("../lib/crud.js");
  var data = { 
  recordType : "XM.OpportunityType",
  autoTestAttributes : true,
  createHash : {
    name : 'Test Name',
    description : 'Test Description'
  },
  updateHash : {
    description : 'Updated Description'
  }
  };
   vows.describe('XM.OpportunityType CRUD test').addBatch({
    'We can run the XM.OpportunityType CRUD tests ': crud.runAllCrud(data)
  }).export(module);
}());