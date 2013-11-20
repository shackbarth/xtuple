/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  /**
    Workflow overview
    @class
    @alias Workflow
  */
  var spec = {
    recordType: "XM.ProjectTypeWorkflow",
    skipBoilerplateTests: true
  };

  var additionalTests = function () {
    it.skip("TODO", function () {

    });
  };

  exports.spec = spec;
  exports.additionalTests = additionalTests;

}());

