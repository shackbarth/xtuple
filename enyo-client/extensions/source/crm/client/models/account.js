/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.crm.initAccountModels = function () {
    /**
      @class

      @extends XM.Model
    */
    XM.AccountToDo = XM.Model.extend(
      /** @scope XM.AccountToDo.prototype */ {

      recordType: 'XM.AccountToDo',

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.AccountIncident = XM.Model.extend(
      /** @scope XM.AccountIncident.prototype */ {

      recordType: 'XM.AccountIncident',

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.AccountIncident = XM.Model.extend(
      /** @scope XM.AccountIncident.prototype */ {

      recordType: 'XM.AccountIncident',

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.AccountOpportunity = XM.Model.extend(
      /** @scope XM.AccountOpportunity.prototype */ {

      recordType: 'XM.AccountOpportunity',

      isDocumentAssignment: true

    });
  };

}());
