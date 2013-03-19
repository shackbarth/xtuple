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
    Test the number widget.
   */
  vows.describe('The NumberWidget kind').addBatch({
    'When we load up our app': {
      topic: function () {
        zombieAuth.loadApp(this.callback);
      },
      'we take the XM namespace': {
        topic: function () {
          return XM;
        },
        'all models should contain their required attributes': function (topic) {
          _.each(topic, function (value, key) {
            if (key.substring(0, 1) === key.toUpperCase().substring(0, 1) &&
                typeof value === 'function' &&
                XT.session.schema.get(key)) {
              var columns = _.map(XT.session.schema.get(key).columns, function (column) {
                return column.name;
              });
              _.each(value.prototype.requiredAttributes, function (attr) {
                assert.ok(_.indexOf(columns, attr) >= 0);
              });
            }
          });
        }
      }
    }
  }).export(module);
}());

