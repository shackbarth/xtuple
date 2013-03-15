/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

  var vows = require('vows'),
      assert = require('assert'),
      zombieAuth = require('../lib/zombie_auth');

(function () {
  "use strict";

  /**
    Test the Report route
  */
  vows.describe('Export route').addBatch({
    'When we load up our app': {
      topic: function () {
        zombieAuth.loadApp(this.callback);
      },
      'a GET to the export route': {
        topic: function (browser) {
          var url = "https://localhost:443/export?details={%22query%22:{%22recordType%22:%22XM.Locale%22}}";
          browser.visit(url, {debug: false}, this.callback);
        },
        'should return ok': function (err, browser, status) {
          assert.ok(browser.success);
        },
        'should not go to the login screen': function (err, browser, status) {
          assert.notEqual(browser.text("title"), "xTuple Login");
        },
        'should return CSV data': function (err, browser, status) {
          var body = browser.text("body"),
            bodyLines = body.split(","),
            jsonError = "We should not be able to parse the result as JSON!";

          try {
            var dummy = JSON.parse(body);
            // I'm sure there's a better assert method for this.
          } catch (dummyError) {
            jsonError = dummyError;
          }
          assert.isFunction(jsonError);

          assert.ok(bodyLines.length > 10);
        }
      },
    }
  }).export(module);
}());

