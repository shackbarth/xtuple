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

  var createHash = {
    number: "Herr"
  };

  var updateHash = {
    number: "Dame"
  };

  /**
    Test the Honorific model
   */
  vows.describe('Quote testing').addBatch({
    'When we load up our app': {
      topic: function () {
        zombieAuth.loadApp(this.callback);
      },
      'We can create a quote model': {
        topic: function () {
          return new XM.Quote();
        },
        'The model is created successfully': function (topic) {
          assert.isObject(topic);
          assert.equal(topic.recordType, "XM.Quote");
        }
      },
      'We can run the CRUD tests for Quote': crud.testCrudOperations("Quote", createHash, updateHash),

      'We can test business logic for Quote': {
        topic: function () {
          return new XM.Quote();
        },
        'The record type is XM.Quote': function (topic) {
          assert.equal(topic.recordType, "XM.Quot");
        }
      }
    }
  }).export(module);
}());
