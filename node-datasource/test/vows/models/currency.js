(function () {
 "use strict";
  var vows = require("vows"),
    assert = require("assert"),
    _ = require("underscore"),
    zombieAuth = require("../lib/zombie_auth.js"),
    crud = require("../lib/crud.js");
  var data = { 
  recordType : "XM.Currency",
  autoTestAttributes : true,
  createHash : {
    name: 'rupee',
    symbol: 'R',
    abbreviation: 'RUP'
  },
  updateHash : {
    name : 'Rupayi'
  }
  };
   vows.describe('XM.Currency CRUD test').addBatch({
    'We can run the XM.Currency CRUD tests ': crud.runAllCrud(data)
  }).export(module);
}());