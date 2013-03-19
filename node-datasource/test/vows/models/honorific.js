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

  data.createHash = {
    code: "Herr" + Math.random()
  };

  data.updateHash = {
    code: "Dame" + Math.random()
  };

  vows.describe('XM.Honorific CRUD test').addBatch({
    'We can INITIALIZE a Honorific Model ': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.Honorific();
            that.callback(null, data);
          };
        zombieAuth.loadApp({callback: callback, verbose: true});
      },
      'Verify the record type is XM.Honorific': function (data) {
        assert.equal(data.model.recordType, "XM.Honorific");
      }
    }
  }).addBatch({
    'We can CREATE a Honorific Model ': crud.create(data, {
      '-> Set values to the Honorific': {
        topic: function (data) {
          data.model.set(data.createHash);
          return data;
        },
        'Verify Last Error is null': function (data) {
          assert.isNull(data.model.lastError);
        },
        '-> Save the Honorific': crud.save(data)
      }
    })
  }).addBatch({
    'We can UPDATE the Honorific ': crud.update(data, {
      '-> Set values': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        '-> Commit to the Honorific': crud.save(data, {
          'destroy': crud.destroy(data)
        })
      }
    })
  }).export(module);

}());
