/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";
  
  XT.extensions.project.initOpportunityModels = function () {
    /**
      @class

      @extends XM.Model
    */
    XM.OpportunityProject = XM.Model.extend(
      /** @scope XM.OpportunityProject.prototype */ {

      recordType: 'XM.OpportunityProject',

      isDocumentAssignment: true

    });
  };

}());
