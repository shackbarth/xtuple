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
    item: {id: 333},
    site: {id: 37}, // NOTE the item and site have to be a combo that doesn't yet exist
    plannerCode: {id: 27, code: "NONE"},
    costCategory: {id: 30, code: "FINISHED"},
    isSold: false
  };

  data.updateHash = {
    isSold: true
  };

  vows.describe('XM.ItemSite CRUD test').addBatch({
    'INITIALIZE ': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.ItemSite();
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'The record type is XM.ItemSite': function (data) {
        assert.equal(data.model.recordType, "XM.ItemSite");
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
  }).addBatch({
    'READ': {
      topic: function () {
        return data;
      },
      'ID is a number': function (data) {
        assert.isNumber(data.model.id);
      },
      'isSold is true': function (data) {
        assert.equal(data.model.get('isSold'), data.createHash.isSold);
      }
    }
  }).addBatch({
    'UPDATE ': crud.update(data, {
      '-> Set values': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        'isSold is false': function (data) {
          assert.equal(data.model.get('isSold'), data.updateHash.isSold);
        },
        '-> Commit': crud.save(data)
      }
    })
  }).addBatch({
    'DESTROY': crud.destroy(data)

  }).addBatch({
    'We can create a new collection and run a non-filtered fetch': {
      topic: function () {
        var that = this,
          coll = new XM.ItemSiteRelationCollection(),
          success = function (data) {
            that.callback(null, data);
          },
          error = function (error) {
            console.log("error!", arguments);
            that.callback(error);
          };

        var query = {"orderBy":[{"attribute":"item.number"}],"parameters":[]};
        coll.fetch({query: query, success: success, error: error});
      },
      'we do get them all back': function (error, topic) {
        assert.isNull(error);
        assert.equal(topic.length, 64);
      }
    }

  }).addBatch({
    'We can create a new collection and run a filtered fetch': {
      topic: function () {
        var that = this,
          coll = new XM.ItemSiteRelationCollection(),
          success = function (data) {
            that.callback(null, data);
          },
          error = function (error) {
            console.log("error!", arguments);
            that.callback(error);
          };
        coll.bespokeFilter = {
          customerId: 97
        };

        var query = {"orderBy":[{"attribute":"item.number"}],"parameters":[]};
        coll.fetch({query: query, success: success, error: error});
      },
      'we do not get them all back': function (error, topic) {
        assert.isNull(error);
        assert.isTrue(topic.length < 64);
      }
    }

  }).addBatch({
    'We can create a new collection and run a filtered fetch for one query': {
      topic: function () {
        var that = this,
          coll = new XM.ItemSiteRelationCollection(),
          success = function (data) {
            that.callback(null, data);
          },
          error = function (error) {
            console.log("error!", arguments);
            that.callback(error);
          };
        coll.bespokeFilter = {
          customerId: 97
        };

        var query = {"orderBy":[{"attribute":"item.number"}],"parameters":[], rowOffset:0, rowLimit:1};
        coll.fetch({query: query, success: success, error: error});
      },
      'we get back an itemsite': function (error, topic) {
        assert.isNull(error);
        assert.equal(topic.length, 1);
        assert.equal(topic[0].site.id, 37);
      }
    }
  }).addBatch({
    'We can create a new collection and run a filtered fetch for one query with a default site': {
      topic: function () {
        var that = this,
          coll = new XM.ItemSiteRelationCollection(),
          success = function (data) {
            that.callback(null, data);
          },
          error = function (error) {
            console.log("error!", arguments);
            that.callback(error);
          };
        coll.bespokeFilter = {
          customerId: 97
        };
        coll.defaultSite = {
          id: 35
        };

        var query = {"orderBy":[{"attribute":"item.number"}],"parameters":[], rowOffset:0, rowLimit:1};
        coll.fetch({query: query, success: success, error: error});
      },
      'we get back an itemsite with the default site first': function (error, topic) {
        assert.isNull(error);
        assert.equal(topic.length, 1);
        assert.equal(topic[0].site.id, 35);
      }
    }

  }).export(module);

}());
