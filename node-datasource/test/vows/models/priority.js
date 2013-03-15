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
    name: "Must Have"
  };

  data.updateHash = {
    name: "Deferred"
  };

  vows.describe('XM.Priority CRUD test').addBatch({

    'INITIALIZE ': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.Priority()
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'The record type is XM.Priority': function (data) {
        assert.equal(data.model.recordType, "XM.Priority");
      },
      'The enforceUpperKey is false': function (data){
        assert.equal(data.model.enforceUpperKey, false);
      },
      'The documentKey is name': function (data) {
        assert.equal(data.model.documentKey, "name");
      },
			'The order is 0': function(data){
				assert.equal(data.model.defaults.order, 0);
			}

    }
  }).addBatch({
    'CREATE ': crud.create(data, {
      '-> Set values': {
        topic: function (data) {
          data.model.set(data.createHash);
          return data;
        },
        'Last Error is null': function (data) {
          assert.isNull(data.model.lastError);
        },
        '-> Save': crud.save(data)
      }
		})
/*	}).addBatch({
	
		'Duplicate ': crud.create(data, {
      '-> Set values': {
        topic: function (data) {
          data.model.set(data.createHash);
          return data;
        },
        '-> Save': crud.save(data),
				'Last Error is true': function (data) {
					console.log(data.model.lastError.toString());
					assert.fail("", data.model.lastError);
				}
      }
    })
*/
  }).addBatch({
    'READ': {
      topic: function () {
        return data;
      },
      'ID is a number': function (data) {
        assert.isNumber(data.model.id);
      },
      'Name is `createHash`': function (data) {
        assert.equal(data.model.get('name'), data.createHash.name);
      }
    }
  }).addBatch({
    'UPDATE ': crud.update(data, {
      '-> Set values': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        'Name is updateHash': function (data) {
          assert.equal(data.model.get('name'), data.updateHash.name);
        },
        '-> Commit': crud.save(data)
      }
    })


  }).addBatch({
    'DESTROY': crud.destroy(data)
		
  }).export(module);

}());

