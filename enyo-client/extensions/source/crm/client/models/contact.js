/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";
  
  XT.extensions.crm.contactModels = function () {
    /**
      @class

      @extends XM.Model
    */
    XM.ContactToDo = XM.Model.extend(
      /** @scope XM.ContactToDo.prototype */ {

      recordType: 'XM.ContactToDo',

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ContactIncident = XM.Model.extend(
      /** @scope XM.ContactIncident.prototype */ {

      recordType: 'XM.ContactIncident',

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ContactOpportunity = XM.Model.extend(
      /** @scope XM.ContactOpportunity.prototype */ {

      recordType: 'XM.ContactOpportunity',

      isDocumentAssignment: true

    });
  };

}());
