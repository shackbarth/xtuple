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
    common = require("../lib/common"),
    assert = require("chai").assert;

  /**
    Sale Type
    @class
    @alias SaleType
    @property {String} code
    @property {String} description
    @property {SalesEmailProfile} emailProfile
    @property {SaleTypeCharacteristicCollection} characteristics
    @property {SalesTypeWorkflow} workflow
    @property {String} defaultHoldType
  */
  var spec = {
    recordType: "XM.SaleType",
    collectionType: "XM.SaleTypeCollection",
    cacheName: null,
    listKind: "XV.SaleTypeList",
    instanceOf: "XM.Document",
    isLockable: true,
    idAttribute: "code",
    enforceUpperKey: true,
    attributes: ["code", "description", "characteristics", "workflow",
      "emailProfile", "defaultHoldType"],
    extensions: ["sales"],
    privileges: {
      createUpdate: "MaintainSaleTypes",
      read: true
    },
    createHash: {
      code: "TESTSALE" + Math.random(),
      description: "Test Sale Type"
    },
    updatableField: "description"
  };

  var additionalTests = function () {
    describe("Sale type characteristics", function () {
      /**
        @member -
        @memberof SaleType.prototype
        @description Characteristics can be associated with sale types.
      */
      it("is a SaleTypeCharacteristic", function () {
        var model;

        assert.isFunction(XM.SaleTypeCharacteristic);
        model = new XM.SaleTypeCharacteristic();
        assert.isTrue(model instanceof XM.CharacteristicAssignment);
      });
      /**
        @member -
        @memberof SaleType.prototype
        @description The available characteristic types are shared with sales orders
      */
      it.skip("uses isSalesOrders as its context attribute", function () {
      });
    });
    describe("SaleTypeWorkflow", function () {
      var saleTypeModel,
        workflowSourceModel;

      before(function (done) {
        async.parallel([
          function (done) {
            common.initializeModel(saleTypeModel, XM.SaleType, function (err, model) {
              saleTypeModel = model;
              saleTypeModel.set(spec.createHash);
              done();
            });
          },
          function (done) {
            common.initializeModel(workflowSourceModel, XM.SaleTypeWorkflow, function (err, model) {
              workflowSourceModel = model;
              done();
            });
          }
        ], done);
      });


      it("can get added to a sale type", function (done) {
        assert.isTrue(workflowSourceModel.isReady());
        workflowSourceModel.set({
          name: "First step",
          priority: XM.priorities.models[0]
        });
        saleTypeModel.get("workflow").add(workflowSourceModel);
        assert.isUndefined(JSON.stringify(saleTypeModel.validate(saleTypeModel.attributes)));
        saleTypeModel.save(null, {success: function () {
          done();
        }});
      });

      /**
        @member -
        @memberof SaleType.prototype
        @description Sales order workflow types can be "Credit Check", "Pack" (inventory only),
          "Ship" (inventory only), and "Other" (default)
      */
      it("workflow type other is default", function () {
        assert.equal(workflowSourceModel.get("workflowType"), XM.SalesOrderWorkflow.TYPE_OTHER);
      });
      it("workflow types are credit check, pack , ship, and other", function () {
        assert.isString(XM.SalesOrderWorkflow.TYPE_OTHER);
        assert.isString(XM.SalesOrderWorkflow.TYPE_CREDIT_CHECK);
        // TODO :implement in inventory
        //assert.isString(XM.SalesOrderWorkflow.TYPE_PACK);
        //assert.isString(XM.SalesOrderWorkflow.TYPE_SHIP);
      });
      it("you can set the workflow type", function () {
        workflowSourceModel.set({workflowType: XM.SalesOrderWorkflow.TYPE_SHIP});
        assert.isUndefined(workflowSourceModel.validate(workflowSourceModel.attributes));
      });


    });
  };

  exports.spec = spec;
  exports.additionalTests = additionalTests;

}());

