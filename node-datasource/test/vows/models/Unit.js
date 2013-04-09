(function () {
 "use strict";
  var vows = require("vows"),
    assert = require("assert"),
    _ = require("underscore"),
    zombieAuth = require("../lib/zombie_auth.js"),
    crud = require("../lib/crud.js");
  var data = { 
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