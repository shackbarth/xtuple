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

  var data = {},
    today = new Date();

  data.createHash = {
    dueDate: today,
    name: "Pass the VOWS tests"
  };

  data.updateHash = {
    name: "Updated"
  };

  vows.describe('XM.ToDo CRUD test').addBatch({
    'We can INITIALIZE a ToDo Model ': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.ToDo();
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'Verify the record type is XM.ToDo': function (data) {
        assert.equal(data.model.recordType, "XM.ToDo");
      }
    }
  }).addBatch({
    'We can CREATE a ToDo Model ': crud.create(data, {
      '-> Set values to ToDo': {
        topic: function (data) {
          data.model.set(data.createHash);
          return data;
        },
        'Verify the Last Error is null': function (data) {
          assert.isNull(data.model.lastError);
        },
        '-> Save the ToDo': crud.save(data)
      }
    })
  }).addBatch({
    'We can READ a ToDo Model': {
      topic: function () {
        return data;
      },
      'Verify the Last Error is null': function (data) {
        assert.isNull(data.model.lastError);
      }
    }
  }).addBatch({
    'We can UPDATE a ToDo Model ': crud.update(data, {
      '-> Set values to ToDo': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        '-> Commit a ToDo': crud.save(data)
      }
    })
  }).addBatch({
    'We can DESTROY a ToDo Model': crud.destroy(data)
  }).export(module);
  
}());
