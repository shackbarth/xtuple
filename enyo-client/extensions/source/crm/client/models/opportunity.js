/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.crm.opportunityModels = function () {
    /**
      @class

      @extends XM.Model
    */
    XM.OpportunityIncident = XM.Model.extend(
      /** @scope XM.OpportunityIncident.prototype */ {

      recordType: 'XM.OpportunityIncident',

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.OpportunityToDo = XM.Model.extend(
      /** @scope XM.OpportunityToDo.prototype */ {

      recordType: 'XM.OpportunityToDo',

      isDocumentAssignment: true

    });
  };

}());
