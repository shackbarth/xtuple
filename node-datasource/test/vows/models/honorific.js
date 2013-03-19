/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var XVOWS = XVOWS || {};
(function () {
  "use strict";

  var vows = require("vows"),
    assert = require("assert"),
    zombieAuth = require("../lib/zombie_auth"),
    crud = require('../lib/crud');

  var data = {};

  data.recordType = "XM.Honorific";

  data.createHash = {
    code: "Herr" + Math.random()
  };

  data.updateHash = {
    code: "Dame" + Math.random()
  };

  vows.describe('XM.Honorific CRUD test').addBatch({
    'We can initialize a model ': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.Honorific();
            that.callback(null, data);
          };
        zombieAuth.loadApp({callback: callback, verbose: true});
      },
      'Verify the record type is correct': function (data) {
        assert.equal(data.model.recordType, data.recordType);
      },
      'We can create a model ': crud.runAllCrud(data)
    }
  }).export(module);

}());
