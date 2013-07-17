/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XZ:true, describe:true, it:true, before:true */

var assert = require("chai").assert,
  zombieAuth = require('../lib/zombie_auth'),
  browser;

(function () {
  "use strict";

  /**
    Test the Report route
  */
  describe('Pentaho report route', function (done) {
    this.timeout(20 * 1000);

    before(function (done) {
      zombieAuth.loadApp(done);
    });

    describe('a GET to the report route for a list', function () {
      it('Should redirect us to pentaho with a key that can give us our data', function (done) {
        // XXX using the Locale business object, of all the options, is confusing because
        // we are also verifying the user's locale information.
        var url = XZ.host + "/" + XZ.database +
            "/report?details={%22query%22:{},%22nameSpace%22:%22XM%22,%22type%22:%22Locale%22," +
            "%22locale%22:{%22currencyScale%22:5}}";

        XZ.browser.visit(url, {debug: false}, function (err, browser, status) {
          var redirectUrl = browser.location.href,
            dataKey = redirectUrl.substring(redirectUrl.indexOf('datakey') + 8),
            url;

          assert.ok(browser.success);

          if (dataKey.indexOf("&") > 0) {
            // allow for future cases where there are more args after the data key
            dataKey = dataKey.substring(0, dataKey.indexOf("&"));
          }
          url = XZ.host + "/" + XZ.database + "/data-from-key?datakey=" + dataKey;

          XZ.browser.visit(url, {debug: false}, function (err, browser, status) {
            var body = JSON.parse(browser.text("body"));

            assert.ok(body.data.length > 1);
            assert.ok(body.data[0].language);
            assert.isNumber(body.locale.currencyScale);
            assert.equal(body.schema.table, "locale");
            done();
          });
        });
      });
    });

    describe('a GET to the report route for one record', function () {
      it('Should redirect us to pentaho with a key that can give us our data', function (done) {
        // XXX using the Locale business object, of all the options, is confusing because
        // we are also verifying the user's locale information.
        var url = XZ.host + "/" + XZ.database +
            "/report?details={%22nameSpace%22:%22XM%22,%22type%22:%22Locale%22,%22id%22:%22Default%22," +
            "%22locale%22:{%22currencyScale%22:5}}";

        XZ.browser.visit(url, {debug: false}, function (err, browser, status) {
          var redirectUrl = browser.location.href,
            dataKey = redirectUrl.substring(redirectUrl.indexOf('datakey') + 8),
            url;

          assert.ok(browser.success);

          if (dataKey.indexOf("&") > 0) {
            // allow for future cases where there are more args after the data key
            dataKey = dataKey.substring(0, dataKey.indexOf("&"));
          }
          url = XZ.host + "/" + XZ.database + "/data-from-key?datakey=" + dataKey;

          XZ.browser.visit(url, {debug: false}, function (err, browser, status) {
            var body = JSON.parse(browser.text("body"));

            assert.equal(typeof body.data, "object");
            assert.ok(body.data.language);
            assert.isNumber(body.locale.currencyScale);
            assert.equal(body.schema.table, "locale");
            done();
          });
        });
      });
    });
  });
}());

