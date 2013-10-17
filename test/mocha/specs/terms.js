/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore"),
    assert = require("chai").assert,
    model;

  var additionalTests = function () {
    it("has the terms type constant DAYS", function () {
      assert.equal(XM.Terms.DAYS, "D");
    });
    it("has the terms type constant PROXIMO", function () {
      assert.equal(XM.Terms.PROXIMO, "P");
    });
    // TODO: these proximo tests should be nested inside

/*
TODO:
When the terms type is set to XM.Terms.DAYS
Validation should check that the dueDays attribute is any positive integer.
the cutOffDate day should be set to read only = true.
*/

    it("when the terms type is set to proximo", function (done) {
      var initComplete = function () {
        model.set(require("../lib/specs").terms.createHash);
        model.set("termsType", XM.Terms.PROXIMO);
        done();
      };

      model = new XM.Terms();
      model.on("statusChange", initComplete);
      model.initialize(null, {isNew: true});
    });
    it("the dueDay attribute should change to 1", function () {
      assert.equal(model.get("dueDays"), 1);
    });
    it("the discountDay attribute should change to 1", function () {
      assert.equal(model.get("discountDays"), 1);
    });
    it("cutOffDay should be set to read only = false", function () {
      assert.equal(model.isReadOnly("cutOffDay"), false);
    });
    it("The cutoffDay attribute should validate only integers between 0 and 31", function () {
      model.set({cutOffDay: "Not a number"});
      assert.isObject(model.validate(model.attributes));
      model.set({cutOffDay: 10.5});
      assert.isObject(model.validate(model.attributes));
      model.set({cutOffDay: -1});
      assert.isObject(model.validate(model.attributes));
      model.set({cutOffDay: 0});
      assert.isUndefined(model.validate(model.attributes));
      model.set({cutOffDay: 32});
      assert.isObject(model.validate(model.attributes));
      model.set({cutOffDay: 31});
      assert.isUndefined(model.validate(model.attributes));
    });
    it("Validation should check that the dueDays attribute is only integers between 0 and 31", function () {
      model.set({dueDays: "Not a number"});
      assert.isObject(model.validate(model.attributes));
      model.set({dueDays: 10.5});
      assert.isObject(model.validate(model.attributes));
      model.set({dueDays: -1});
      assert.isObject(model.validate(model.attributes));
      model.set({dueDays: 0});
      assert.isUndefined(model.validate(model.attributes));
      model.set({dueDays: 32});
      assert.isObject(model.validate(model.attributes));
      model.set({dueDays: 31});
      console.log(JSON.stringify(model.validate(model.attributes)));
      assert.isUndefined(JSON.stringify(model.validate(model.attributes)));
    });
  };

  exports.additionalTests = additionalTests;

}());
