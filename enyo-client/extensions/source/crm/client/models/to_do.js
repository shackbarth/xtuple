/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.crm.toDoModels = function () {
    /**
      @class

      @extends XM.Model
    */
    XM.ToDoIncident = XM.Model.extend(
      /** @scope XM.ToDoIncident.prototype */ {

      recordType: 'XM.ToDoIncident',

      isDocumentAssignment: true

    });
  
    /**
      @class

      @extends XM.Model
    */
    XM.ToDoOpportunity = XM.Model.extend(
      /** @scope XM.ToDoOpportunity.prototype */ {

      recordType: 'XM.ToDoOpportunity',

      isDocumentAssignment: true

    });
  };

}());
