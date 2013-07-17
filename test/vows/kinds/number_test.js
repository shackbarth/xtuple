/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var XVOWS = XVOWS || {};
(function () {
  "use strict";

  var zombieAuth = require("../../mocha/lib/zombie_auth"),
    vows = require("vows"),
    assert = require("assert");

  /**
    Test the number widget.
   */
  vows.describe('The NumberWidget kind').addBatch({
    'When we load up our app': {
      topic: function () {
        zombieAuth.loadApp(this.callback);
      },
      'we can create a NumberWidget': {
        topic: function () {
          return new XV.NumberWidget();
        },
        'which can deal with decimals': function (topic) {
          topic.setScale(1);
          topic.setValue(4.6);
          assert.equal(topic.getValue(), 4.6);
        },
        // XXX all these tests run at the same time (in theory), which might
        // cause a collision. Then again, it might not, as javascript is single-
        // threaded. If we need to we can create a topic for each of these tests,
        // which will solve that problem but will have some extra code.
        'which can round to the scale that is set': function (topic) {
          topic.setScale(0);
          topic.setValue(4.6);
          assert.equal(topic.getValue(), 5);
        },
        'rounding up to pennies': function (topic) {
          topic.setScale(2);
          topic.setValue(15.499);
          assert.equal(topic.getValue(), 15.50);
        },
        'rounding down to pennies': function (topic) {
          topic.setScale(2);
          topic.setValue(15.494);
          assert.equal(topic.getValue(), 15.49);
        },
        'which ignores the empty string': function (topic) {
          topic.setValue('');
          assert.equal(topic.getValue(), null);
        },
        'which ignores non-numeric input': function (topic) {
          topic.setValue('junk_input');
          assert.equal(topic.getValue(), null);
        },
        'which accepts zero': function (topic) {
          topic.setValue(0);
          assert.equal(topic.getValue(), 0);
        },
        'divide by zero': function (topic){
                topic.setValue(1/0);
                assert.equal(topic.getValue(), Infinity);
        },
        'divide zero by zero': function (topic){
                topic.setValue(0/0);
                assert.isNaN(topic.getValue());
    		}

        // TODO: this test fails and it's unclear if that's by design or not
        //'which accepts strings that look like numbers': function (topic) {
        //  topic.setValue('7');
        //  assert.equal(topic.getValue(), 7);
        //}
      }
    }
  }).export(module);
}());
