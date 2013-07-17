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
      'we look at the XM namespace': {
        topic: function () {
          return XM;
        },
        'all models should contain their required attributes': function (topic) {
          var columns,
            model,
            // XXX deal with this better
            settingsModels = ['Crm', 'Sales', 'DatabaseInformation'],
            errors = null;

          _.each(topic, function (value, key) {
            if (key.substring(0, 1) === key.toUpperCase().substring(0, 1) &&
                typeof value === 'function' &&
                XT.session.schema.get(key)) {
              columns = _.map(XT.session.schema.get(key).columns, function (column) {
                return column.name;
              });

              model = new XM[key]();
              _.each(model.requiredAttributes, function (attr) {

                if (_.indexOf(columns, attr) < 0 && _.indexOf(settingsModels, key) < 0) {
                  errors = errors || [];
                  errors.push("Required field " + attr + " is not in model " + key);
                }
              });
            }
          });
          assert.isNull(errors);
        }
      }
    }
  }).export(module);
}());

