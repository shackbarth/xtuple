/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.crm.incidentModels = function () {
    /**
      @class

      @extends XM.Model
    */
    XM.IncidentOpportunity = XM.Model.extend(
      /** @scope XM.IncidentOpportunity.prototype */ {

      recordType: 'XM.IncidentOpportunity',

      isDocumentAssignment: true

    });
  
    /**
      @class

      @extends XM.Model
    */
    XM.IncidentToDo = XM.Model.extend(
      /** @scope XM.IncidentToDoprototype */ {

      recordType: 'XM.IncidentToDo',

      isDocumentAssignment: true

    });
  };

}());
