(function () {
 "use strict";
  var vows = require("vows"),
    assert = require("assert"),
    _ = require("underscore"),
    zombieAuth = require("../lib/zombie_auth.js"),
    crud = require("../lib/crud.js");
  var data = { 
  createHash : {
    name : 'Test Name',
    description : 'Test Description'
  },
  updateHash : {
    description : 'Updated Description'
  }
  };
  vows.describe('XM.OpportunityType CRUD Test').addBatch({
    'INITIAliZE' : {
      topic: function () {
        var that = this,
        callback = function () {
          data.model = new XM.OpportunityType();
          that.callback(null, data);
        };
        zombieAuth.loadApp(callback);
      },
      'The record type is OpportunityType': function(data) {
        assert.equal(data.model.recordType, "XM.OpportunityType");
      }
    }
  }).addBatch({
    'Create' : crud.create(data, {
      'set values' : {
        topic : function(){
          data.model.set(data.createHash);
          return data;
        },
        'Verify the Last Error is null': function (data) {
          assert.isNull(data.model.lastError);
        },
        'save->' : crud.save(data)
        }
      })
  }).addBatch({
    'CHECKS PARAMETERS' : {
      topic : function () {
        return data;
      },
      'required attributes' : {
        'name is required' : function () {
          assert.isTrue(_.contains(data.model.requiredAttributes, "name"));
        }
      }
    }
  }).addBatch({
    'We can UPDATE the Opportunity Type': crud.update(data, {
      '-> Set values': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        '-> Commit Opportunity Type': crud.save(data)
      }
    })
  }).addBatch({
    'Delete' : crud.destroy(data)
  }).export(module);
}());