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
    skipAll: true, // XXX TODO bring back
    recordType: "XM.ProjectType",
    skipSmoke: true,
    collectionType: "XM.ProjectTypeCollection",
    cacheName: null,
    listKind: "XV.ProjectTypeList",
    instanceOf: "XM.Document",
    isLockable: false,
    idAttribute: "code",
    enforceUpperKey: false,
    attributes: ["code", "description"],
    extensions: ["project"],
    privileges: {
      createUpdate: "MaintainProjectTypes",
      read: true
    },
    createHash: {
      code: "TestProjectType" + Math.random(),
      description: "Test project type",
    },
    defaults: {
      isActive: true
    },
    updatableField: "description"
  };

  var additionalTests = function () {
    describe("ProjectTypeWorkflow", function () {
      var projectTypeModel,
        workflowSourceModel;
      //var models = {
      //  projectTypeModel: null,
      //  workflowSourceModel : null
      //};

      before(function (done) {
        //common.prepModels(models);
        async.parallel([
          function (done) {
            common.initializeModel(projectTypeModel, XM.ProjectType, function (err, model) {
              projectTypeModel = model;
              projectTypeModel.set(spec.createHash);
              done();
            });
          },
          function (done) {
            common.initializeModel(workflowSourceModel, XM.ProjectTypeWorkflow, function (err, model) {
              workflowSourceModel = model;
              done();
            });
          }
        ], done);
      });


      it("can get added to a project type", function (done) {
        assert.isTrue(workflowSourceModel.isReady());
        workflowSourceModel.set({
          name: "First step",
          priority: XM.priorities.models[0]
        });
        projectTypeModel.get("workflow").add(workflowSourceModel);
        assert.isUndefined(JSON.stringify(projectTypeModel.validate(projectTypeModel.attributes)));
        projectTypeModel.save(null, {success: function () {
          done();
        }});
      });

      it.skip('Allow New Workflow when editing an existing Project Type', function () {
      });

    });
  };

  exports.spec = spec;
  exports.additionalTests = additionalTests;

}());
