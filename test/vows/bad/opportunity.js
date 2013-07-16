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
    account: {
      id: 1
    },
    name: 'Mike',
    opportunityStage: { id: 'RECEIVED' },
    opportunitySource: { id: 'INTERNAL' },
    opportunityType: { id: 'PRODUCT' }
  };

  data.updateHash = {
    name: 'Mikey'
  };

  vows.describe('XM.Opportunity CRUD test').addBatch({
    'Initialize Opportunity': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.Opportunity();
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'The record type is XM.Opportunity': function (data) {
        assert.equal(data.model.recordType, "XM.Opportunity");
      }
    }
  }).addBatch({
    'Create Opportunity ': crud.create(data, {
      '-> Set values': {
        topic: function (data) {
          data.model.set('opportunityStage', XM.opportunityStages.where({description: 'Internal'}));
          data.model.set('opportunitySource', XM.opportunitySources.where({name: 'RECEIVED'}));
          data.model.set('opportunityType', XM.opportunityTypes.where({name: 'PRODUCT'}));
          data.model.set(data.createHash);
          return data;
        },
        'Last Error is null': function (data) {
          assert.isNull(data.model.lastError);
        },
        '-> Save': crud.save(data)
      }
    })
  }).addBatch({
    'Read Opportunity': {
      topic: function () {
        return data;
      },
      'Last Error is null': function (data) {
        assert.isNull(data.model.lastError);
      }
    }
  }).addBatch({
    'Update Opportunity ': crud.update(data, {
      '-> Set values': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        '-> Commit': crud.save(data)
      }
    })
  }).addBatch({
    'Destroy Opportunity': crud.destroy(data)
  }).export(module);

}());
