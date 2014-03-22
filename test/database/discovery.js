/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, XM:true, XV:true, XZ:true, describe:true, it:true */

(function () {
  "use strict";

  var zombie = require("zombie"),
    mocha = require("mocha"),
    assert = require("chai").assert;

  var loginData = require('../lib/login_data'),
    database = loginData.data.org,
    host = loginData.data.webaddress || "https://localhost",
    delimiter = host.charAt(host.length - 1) === "/" ? "" : "/",
    discoveryPath = host + delimiter + database + "/discovery/v1alpha1/apis/v1alpha1/rest";

  describe('The REST discovery document', function (done) {
    it('should load', function (done) {
      this.timeout(60000);
      zombie.visit(discoveryPath, {maxWait: 60000}, function (e, browser) {
        var doc;

        assert.ok(browser.success);
        doc = JSON.parse(browser.text("body"));
        assert.isString(doc.discoveryVersion);
        assert.isObject(doc.schemas.Country);
        assert.isObject(doc.resources.Sales);
        done();
      });
    });
  });
}());
