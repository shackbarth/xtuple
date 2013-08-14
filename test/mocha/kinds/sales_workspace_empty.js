/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, describe:true, it:true,
  before:true, module:true, require:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    assert = require("chai").assert,
    zombieAuth = require("../lib/zombie_auth"),
    smoke = require("../lib/smoke"),
    testData = [
      {kind: "XV.TaxRateList" },
      {kind: "XV.TaxCodeList" },
    ];

  describe('Sales Workspaces', function () {

    before(function (done) {
      this.timeout(30 * 1000);
      zombieAuth.loadApp(done);
    });

    describe('Trivial tests', function () {
      _.each(testData, smoke.saveEmptyToFail);
    });
    /*
    */
  });
}());
