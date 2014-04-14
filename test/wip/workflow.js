/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, setTimeout:true, XM:true, require:true, assert:true,
before:true, exports:true, it:true, describe:true, XG:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    assert = require("chai").assert,
    crud = require("../lib/crud"),
    smoke = require("../lib/smoke"),
    zombieAuth = require("../lib/zombie_auth"),
    utils = 1;

  describe('Navigate to activity list', function () {
    var postbooks;
    this.timeout(40 * 1000);

    before(function (done) {
      this.timeout(30 * 1000);
      zombieAuth.loadApp(done);
    });

    //var app = XT.app;
    it("should navigate to activity list", smoke.navigateToList("XT.app", "XV.ActivityList"));

  });

  //smoke.navigateToList(XT.app, "XV.ActivityList");

}());
