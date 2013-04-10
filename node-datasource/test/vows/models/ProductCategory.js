(function () {
 "use strict";
  var vows = require("vows"),
    assert = require("assert"),
    _ = require("underscore"),
    zombieAuth = require("../lib/zombie_auth.js"),
    crud = require("../lib/crud.js");
  var data = { 
  recordType : "XM.ProductCategory",
  autoTestAttributes : true,
  createHash : {
    code : 'CLASSIC-WOOD1',
    description : 'Product Category Description'
  },
  updateHash : {
    description : 'Updated Description'
  }
  };
   vows.describe('XM.ProductCategory CRUD test').addBatch({
    'We can run the XM.ProductCategory CRUD tests ': crud.runAllCrud(data)
  }).export(module);
}());