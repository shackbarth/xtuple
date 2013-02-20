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
    // TODO: flesh these out
    number: "3453458" + Math.random(),
    customer: {id: 97},
    miscCharge: 0,
    status: "O",
    calculateFreight: false,
  };

  var updateHash = {
    shipVia: "Gottingen"
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
          //console.log(topic.getAttributeNames());
          //console.log(topic.requiredAttributes);
          assert.isObject(topic);
          assert.equal(topic.recordType, "XM.Quote");
        }
      },
      'We can run the CRUD tests for Quote': crud.testCrudOperations("Quote", createHash, updateHash),

      'We can test business logic for Quote': {
        topic: function () {
          return new XM.Quote();
        },
        'The blah is blah': function (topic) {
          assert.equal(1 + 2, 3);
        }
      }
    }
  }).export(module);
}());
