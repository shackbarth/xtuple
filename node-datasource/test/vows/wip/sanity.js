/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, _:true, module:true, require:true */

var XVOWS = XVOWS || {};
(function () {
  "use strict";

  var zombieAuth = require("../lib/zombie_auth"),
    _ = require("underscore"),
    vows = require("vows"),
    assert = require("assert");

  /**
    Sanity check our kinds
   */
  vows.describe('Sanity checking on kinds').addBatch({
    'When we load up our app': {
      topic: function () {
        zombieAuth.loadApp(this.callback);
      },
      'we look at the XV namespace': {
        topic: function () {
          return XV;
        },
        'all kinds should be instantiable': function (topic) {
          var kind,
            errors = null,
            master = new enyo.Control,
            // XXX this is a little hackish
            knownAbstractKinds = ['ListRelationsBox', 'ListRelationsEditorBox', 'AssignmentBox'],
            child;

          _.each(topic, function (value, key) {
            if (key.substring(0, 1) === key.toUpperCase().substring(0, 1) &&
                typeof value === 'function') {
              console.log(key, value);
              // XXX why are these three kinds not instantiable?
              if (_.indexOf(knownAbstractKinds, key) >= 0) {
                return;
              }
              child = master.createComponent({
                kind: "XV." + key,
                name: key
              });
              if (master.$[key].kind !== 'XV.' + key) {
                errors = errors || [];
                errors.push("Error instantiating XV." + key);
              }
              // XXX this test isn't really useful yet
            }
          });
          assert.isNull(errors);
        }
      }
    }
  }).export(module);
}());

