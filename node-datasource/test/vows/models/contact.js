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
    firstName: "Michael",
    primaryEmail: "modonnell@xtuple.com"
  };

  data.updateHash = {
    firstName: "Mike"
  };

  vows.describe('XM.Contact CRUD test').addBatch({
    'We can INITIALIZE a Contact Model': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.Contact();
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'Verify the record type is XM.Contact': function (data) {
        assert.equal(data.model.recordType, "XM.Contact");
      }
    }
  }).addBatch({
    'We can CREATE a Contact ': crud.create(data, {
      '-> Set values of the Contact': {
        topic: function (data) {
          data.model.set(data.createHash);
          data.model.unset('address'); //because asynchronus nonsense
          return data;
        },
        'Verify the Last Error is null': function (data) {
          assert.isNull(data.model.lastError);
        },
        '-> Save the Contact': crud.save(data)
      }
    })
  }).addBatch({
    'We can READ a Contact': {
      topic: function () {
        return data;
      },
      'ID is a string': function (data) {
        assert.isString(data.model.id);
      },
      'Five equals five.': function (data) {
        assert.equal(5, 5);
      }
    }
  }).addBatch({
    'We can UPDATE a Contact Model': crud.update(data, {
      '-> Set values of the Contact': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        'Contact Name is `Mike`': function (data) {
          assert.equal(data.model.get("name"), data.updateHash.name);
        },
        '-> Commit the Contact': crud.save(data)
      }
    })
  }).addBatch({
    'We can DESTROY a Contact Model': crud.destroy(data)
  }).export(module);
  
}());
