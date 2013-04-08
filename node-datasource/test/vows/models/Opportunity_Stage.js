(function () {
 "use strict";
  var vows = require("vows"),
    assert = require("assert"),
    _ = require("underscore"),
    zombieAuth = require("../lib/zombie_auth.js"),
    crud = require("../lib/crud.js");
  var data = { 
  recordType : "XM.OpportunityStage",
  autoTestAttributes : true,
  createHash : {
    name: 'Stage',
    description: 'Description',
    deactivate: true
  },
  updateHash : {
    description : 'Update Description'
  }
  };
   vows.describe('XM.OpportunityStage CRUD test').addBatch({
    'We can run the XM.OpportunityStage CRUD tests ': crud.runAllCrud(data)
  }).export(module);
}());