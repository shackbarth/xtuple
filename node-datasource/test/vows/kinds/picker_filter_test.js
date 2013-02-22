/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var XVOWS = XVOWS || {};
(function () {
  "use strict";

  var zombieAuth = require("../lib/zombie_auth"),
    vows = require("vows"),
    assert = require("assert");

  /**
    Test the number widget.
   */
  vows.describe('Picker widget filtering').addBatch({
    'When we load up our app': {
      topic: function () {
        zombieAuth.loadApp(this.callback);
      },
      'we can create a Contact Picker Widget': {
        topic: function () {
          var widget = new XV.ContactWidget();
          widget.$.input.setValue("a");
          widget.autocomplete(this.callback);
        },
        'which can deal with decimals': function (topic) {
          console.log(topic.getValue());
          assert.equal(topic.kind, "XV.ContactPicker");
        }
      }
    }
  }).export(module);
}());
