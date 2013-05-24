/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var XVOWS = XVOWS || {};
(function () {
  "use strict";

  var zombieAuth = require("../../mocha/lib/zombie_auth"),
    vows = require("vows"),
    _ = require("underscore"),
    assert = require("assert");

  /**
    Test the parameter widget.
   */
  vows.describe('The ParameterWidget kind').addBatch({
    'When we load up our app': {
      topic: function () {
        zombieAuth.loadApp(this.callback);
      },
      'we can create a NumberWidget': {
        topic: function () {
          return new XV.ContactListParameters();
        },
        'which can take a string as a filter name and set the item correctly': function (topic) {
          var valueSet;
          // XXX probably too much mocking.
          topic.$.account.setValue = function (value) {
            valueSet = value.id;
          };
          topic.setParameterItemValues([{name: 'account', value: {id: 19}}]);
          assert.equal(valueSet, 19);
        },
        'which can take an array as a filter name and set the item correctly': function (topic) {
          var valueSet;
          // XXX probably too much mocking.
          topic.$.account.setValue = function (value) {
            valueSet = value.id;
          };
          topic.setParameterItemValues([{name: ['account', 'accountParent'], value: {id: 19}}]);
          assert.equal(valueSet, 19);
        }
      }
    }
  }).export(module);
}());
