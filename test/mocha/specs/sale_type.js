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

  var spec = {
    recordType: "XM.SaleType",
    collectionType: "XM.SaleTypeCollection",
    cacheName: null,
    listKind: "XV.SaleTypeList",
    instanceOf: "XM.Document",
    isLockable: true,
    idAttribute: "code",
    enforceUpperKey: true,
    attributes: ["code", "description"],
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
    describe("SaleTypeWorkflow", function () {
      var saleTypeModel,
        workflowSourceModel;
      //var models = {
      //  projectTypeModel: null,
      //  workflowSourceModel : null
      //};

      before(function (done) {
        //common.prepModels(models);
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


    });
  };

  exports.spec = spec;
  exports.additionalTests = additionalTests;

}());

