/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require('./crud'),
    smoke = require('./smoke'),
    specs = require('./specs'),
    assert = require("chai").assert,
    _ = require("underscore");

  _.each(specs, function (spec) {

    describe(spec.recordType, function () {
      //
      // Smoke Crud
      //
      //smoke.runUICrud(spec);

      //
      // Run CRUD model tests
      //
      crud.runAllCrud(spec);

      //model = spec.model;
      //
      // Verify lockability
      //
      if (spec.isLockable === true) {
        it("is lockable", function () {
          assert.isTrue(spec.model.lockable);
        });
      } else if (spec.isLockable === false) {
        it("is not lockable", function () {
          assert.isFalse(spec.model.lockable);
        });
      } else {
        it("has its lockability defined in the test spec", function () {
          assert.fail();
        });
      }

      //
      // Verify inheritance
      //
      if (spec.instanceOf === "XM.Document") {
        it("inherits from XM.Document", function () {
          assert.isTrue(spec.model instanceof XM.Document);
        });
      } else if (spec.instanceOf === "XM.Model") {
        it("inherits from XM.Model but not XM.Document", function () {
          assert.isTrue(spec.model instanceof XM.Model);
          assert.isFalse(spec.model instanceof XM.Document);
        });
      } else {
        it("has its inheritance defined in the test spec", function () {
          assert.fail();
        });
      }

      //
      // Verify ID attribute
      //
      if (spec.idAttribute) {
        it("has " + spec.idAttribute + " as its idAttribute", function () {
          assert.equal(spec.idAttribute, spec.model.idAttribute);
          if (spec.instanceOf === "XM.Document") {
            // Documents have the same value as their document key
            assert.equal(spec.idAttribute, spec.model.documentKey);
          }
        });
      } else {
        it("has its id attribute defined in the test spec", function () {
          assert.fail();
        });
      }

      //
      // Make sure we're testing the enforceUpperCase (the asserts themselves are in CRUD)
      //
      if (!_.isBoolean(spec.enforceUpperKey)) {
        it("has its enforceUpperKey convention defined in the test spec", function () {
          assert.fail();
        });
      }

      //
      // Verify attributes
      //
      _.each(spec.attributes, function (attr) {
        it("contains the " + attr + " attribute", function () {
          assert.include(spec.model.getAttributeNames(), attr);
        });
      });
      if (!spec.attributes || spec.attributes.length === 0) {
        it("has some attributes defined in the test spec", function () {
          assert.fail();
        });
      }


    });
  });
}());
