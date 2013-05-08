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

    'We can INITIALIZE a Priority Model': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.Priority()
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'Verify the record type is XM.Priority': function (data) {
        assert.equal(data.model.recordType, "XM.Priority");
      },
      'Verify the enforceUpperKey is false': function (data){
        assert.equal(data.model.enforceUpperKey, false);
      },
      'Verify the documentKey is name': function (data) {
        assert.equal(data.model.documentKey, "name");
      },
			'Verify the order is 0': function(data){
				assert.equal(data.model.defaults.order, 0);
			}

    }
  }).addBatch({
    'We can CREATE a Priority Model ': crud.create(data, {
      '-> Set values': {
        topic: function (data) {
          data.model.set(data.createHash);
          return data;
        },
        'Verify the Last Error is null': function (data) {
          assert.isNull(data.model.lastError);
        },
        '-> Save the Incident': crud.save(data)
      }
		})
/*	}).addBatch({
	
		'We cannot Duplicate a Priority ': crud.create(data, {
      '-> Set values as a Duplicate Priority': {
        topic: function (data) {
          data.model.set(data.createHash);
          return data;
        },
        '-> Attempt to Save Duplicate Priority': crud.save(data),
				'Verify the Last Error is true': function (data) {
					console.log(data.model.lastError.toString());
					assert.fail("", data.model.lastError);
				}
      }
    })
*/
  }).addBatch({
    'We can READ from a Priority Model': {
      topic: function () {
        return data;
      },
      'Verify the ID is a string': function (data) {
        assert.isString(data.model.id);
      },
      'Verify the Name is from createHash': function (data) {
        assert.equal(data.model.get('name'), data.createHash.name);
      }
    }
  }).addBatch({
    'We can UPDATE a Priority Model ': crud.update(data, {
      '-> Set values to the Priority': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        'Verify the Name is from updateHash': function (data) {
          assert.equal(data.model.get('name'), data.updateHash.name);
        },
        '-> Commit the Priority': crud.save(data)
      }
    })


  }).addBatch({
    'We can DESTROY a Priority Model': crud.destroy(data)
		
  }).export(module);

}());

