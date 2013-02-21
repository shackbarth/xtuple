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
  vows.describe('Report route').addBatch({
    'When we load up our app': {
      topic: function () {
        zombieAuth.loadApp(this.callback);
      },
      'a GET to the report route for a list': {
        topic: function (browser) {
          var url = "https://localhost:443/report?details={%22query%22:{%22recordType%22:%22XM.Locale%22}}";
          browser.visit(url, {debug: false}, this.callback);
        },
        'should return ok': function (err, browser, status) {
          assert.ok(browser.success);
        },
        'should go to maxhammer': function (err, browser, status) {
          console.log(browser.text("body"));
          assert.equal(browser.location.host, "maxhammer.xtuple.com:8080");
          assert.equal(browser.text("title"), "Report Web Viewer"); // that's pentaho's title
        },
        'should generate a data key which we can ask about': {
          topic: function (err, browser, status) {
            var redirectUrl = browser.location.href,
              dataKey = redirectUrl.substring(redirectUrl.indexOf('dataKey') + 8),
              url;

            if (dataKey.indexOf("&") > 0) {
              // allow for future cases where there are more args after the data key
              dataKey = dataKey.substring(0, dataKey.indexOf("&"));
            }
            url = "https://localhost:443/dataFromKey?dataKey=" + dataKey;

            browser.visit(url, {debug: false}, this.callback);
          },
          'which will give us some data': function (err, browser, status) {
            var results = JSON.parse(browser.text("body")).data;
            assert.ok(results.length > 1);
          },
          'which will give us data with locale information': function (err, browser, status) {
            var results = JSON.parse(browser.text("body")).data;
            assert.ok(results[0].language);
          }
        }
      }
    }
  }).addBatch({
    'When we load up our app': {
      topic: function () {
        zombieAuth.loadApp(this.callback);
      },
      'a GET to the report route for a particular record': {
        topic: function (browser) {
          var url = "https://localhost:443/report?details={%22recordType%22:%22XM.Locale%22,%22id%22:3}";
          browser.visit(url, {debug: false}, this.callback);
        },
        'should return ok': function (err, browser, status) {
          assert.ok(browser.success);
        },
        'should go to maxhammer': function (err, browser, status) {
          assert.equal(browser.location.host, "maxhammer.xtuple.com:8080");
          assert.equal(browser.text("title"), "Report Web Viewer"); // that's pentaho's title
        },
        'should generate a data key which we can ask about': {
          topic: function (err, browser, status) {
            var redirectUrl = browser.location.href,
              dataKey = redirectUrl.substring(redirectUrl.indexOf('dataKey') + 8),
              url;

            if (dataKey.indexOf("&") > 0) {
              // allow for future cases where there are more args after the data key
              dataKey = dataKey.substring(0, dataKey.indexOf("&"));
            }
            url = "https://localhost:443/dataFromKey?dataKey=" + dataKey;

            browser.visit(url, {debug: false}, this.callback);
          },
          'which will give us data object with locale information': function (err, browser, status) {
            var result = JSON.parse(browser.text("body")).data;
            assert.equal(typeof result, "object");
            assert.ok(result.language);
          }
        }
      }
    }
  }).export(module);
}());

