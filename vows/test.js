// Contributions of status related functionality borrowed from SproutCore:
// https://github.com/sproutcore/sproutcore

/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true */
/*jslint bitwise: true, nomen: true, indent:2 */
/*global XT:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  var vows = require('vows'),
      assert = require('assert');

  vows.watch = true;
  
    // Create a Test Suite
  vows.describe('Division by Zero').addBatch({
    'when dividing a number by zero': {
      topic: function () { return 42 / 0; },

      'we get Infinity': function (topic) {
          assert.equal(topic, Infinity);
        }
    },
    'but when dividing zero by zero': {
      topic: function () { return 0 / 0; },

      'we get a value which': {
        'is not a number': function (topic) {
          assert.isNaN(topic);
        },
        'is not equal to itself': function (topic) {
          assert.notEqual(topic, topic);
        }
      }
    }
  }).export(module);

}());