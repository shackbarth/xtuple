/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, console:true, process:true, module:true, require:true */

var XVOWS = XVOWS || {};
(function () {
  "use strict";

  var vows = require("vows"),
    assert = require("assert"),
    crud = require('../lib/crud'),
    data = {
      recordType: "XM.ItemSite",
      autoTestAttributes: true,
      createHash: {
        item: {id: 333},
        site: {id: 37}, // NOTE the item and site have to be a combo that doesn't yet exist
        plannerCode: {id: 27, code: "NONE"},
        costCategory: {id: 30, code: "FINISHED"},
        isSold: false
      },
      updateHash: {
        isSold: true
      }
    };

  vows.describe('XM.ItemSite tests').addBatch({
    'We can run the XM.ItemSite CRUD tests ': crud.runAllCrud(data)

  }).addBatch({
    // Business-logic specific tests to be run outside of crud
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

        var query = {"orderBy": [{"attribute": "item.number"}], "parameters": []};
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

        var query = {"orderBy": [{"attribute": "item.number"}],
          "parameters": [{attribute: "customer", value: {id: 97}}]};
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

        var query = {"orderBy": [{"attribute": "item.number"}],
          "parameters": [{attribute: "customer", value: {id: 97}}], rowOffset: 0, rowLimit: 1};
        coll.fetch({query: query, success: success, error: error});
      },
      'we get back an itemsite': function (error, topic) {
        assert.isNull(error);
        assert.equal(topic.length, 1);
        assert.equal(topic[0].site.id, 37);
      }
    }
  }).export(module);

}());
