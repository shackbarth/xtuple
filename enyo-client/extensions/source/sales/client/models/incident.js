/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.sales.initIncidentModels = function () {
    /**
      @class

      @extends XM.Model
    */
    XM.IncidentCustomer = XM.Model.extend(
      /** @scope XM.IncidentCustomer.prototype */ {

      recordType: 'XM.IncidentCustomer',

      isDocumentAssignment: true

    });

  };

}());
