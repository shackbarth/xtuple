/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.crm.initInvoiceModels = function () {
    /**
      @class

      @extends XM.Model
    */
    XM.InvoiceIncident = XM.Model.extend(
      /** @scope XM.InvoiceIncident.prototype */ {

      recordType: 'XM.InvoiceIncident',

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.InvoiceOpportunity = XM.Model.extend(
      /** @scope XM.InvoiceOpportunity.prototype */ {

      recordType: 'XM.InvoiceOpportunity',

      isDocumentAssignment: true

    });

  };

}());


