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

  // TODO: flesh these out
  var createHash = {
    number: "TESTCONTACT",
    name: "TESTCONTACTNAME",
    address: 3
  };

  var updateHash = {
    number: "TESTEDCONTACT"
  };

  vows.describe('Contact testing').addBatch({
    'When we load up our app': {
      topic: function () {
        zombieAuth.loadApp(this.callback);
      },

      // TODO: this is not working yet
      'We can run the CRUD tests for Contact': crud.testCrudOperations("Contact", createHash, updateHash),

      'We can test business logic for Contact': {
        topic: function () {
          return new XM.Contact();
        },
        'The record type is XM.Contact': function (topic) {
          // TODO: test business logic for real
          assert.equal(topic.recordType, "XM.Contact");
        },
        'whose type is read-only': function (topic) {
          assert.isTrue(topic.isReadOnly("type"));
        },
        'and we can create a workspace to front it': function (topic) {
          var workspace = new XV.ContactWorkspace();
          workspace.setValue(topic);
          assert.equal(workspace.getValue().recordType, 'XM.Contact');
        }
      }
    }
  }).export(module);
}());
