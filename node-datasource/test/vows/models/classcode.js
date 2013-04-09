(function () {
 "use strict";
  var vows = require("vows"),
    assert = require("assert"),
    _ = require("underscore"),
    zombieAuth = require("../lib/zombie_auth.js"),
    crud = require("../lib/crud.js");
  var data = { 
  recordType : "XM.ClassCode",
  autoTestAttributes : true,
  createHash : {
    code: 'test code',
    description: 'code description'
  },
  updateHash : {
    description : 'update description'
  }
  };
   vows.describe('XM.Class Code CRUD test').addBatch({
    'We can run the XM.Class Code CRUD tests ': crud.runAllCrud(data)
  }).export(module);
}());