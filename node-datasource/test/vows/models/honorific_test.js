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
    code: "Herr"
  };

  var updateHash = {
    code: "Dame"
  };

  vows.describe('Honorific testing').addBatch({
    'When we load up our app': {
      topic: function () {
        zombieAuth.loadApp(this.callback);
      },
      'We can run the CRUD tests for Honorific': crud.testCrudOperations("Honorific", createHash, updateHash),

      'We can test business logic for Honorific': {
        topic: function () {
          return new XM.Honorific();
        },
        'The record type is XM.Honorific': function (topic) {
          // This is trivial I know but there's not much here to test
          assert.equal(topic.recordType, "XM.Honorific");
        }
      }
    }
  }).export(module);
}());
