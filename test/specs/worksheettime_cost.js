/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";
  var async = require("async"),
    _ = require("underscore"),
    smoke = require("../lib/smoke"),
    assert = require("chai").assert;
  var additionalTests = function () {
    describe.skip("Employee cost in time sheets", function () {
      it("Hourly Cost should be automatically filled from the Employee record", function () {
      });
      it("Hourly cost should be editable", function () {
      });
      it("Total value should be calculated correctly using the formula '" +
					"Hours*Hourly Cost'", function () {
      });
    });
    it.skip("Cost header and Cost widgets should be hidden when " +
		"'Maintain All Employee Costs' privilege is not available for the user", function () {
    });
  };
  exports.spec = {
    skipAll: true,
    // XXX very awkward
    recordType: "WorksheetTimeCosts"
  };
  exports.additionalTests = additionalTests;
}());

