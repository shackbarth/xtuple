/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.project.initInvoiceModels = function () {
    /**
      @class

      @extends XM.Model
    */
    XM.InvoiceProject = XM.Model.extend(
      /** @scope XM.InvoiceProject.prototype */ {

      recordType: 'XM.InvoiceProject',

      isDocumentAssignment: true

    });

    //
    // Extend invoice bindEvents so that posted invoices's project attribute will be read-only
    //
    var oldApplyIsPostedRules = XM.Invoice.prototype.applyIsPostedRules;
    XM.Invoice = XM.Invoice.extend({

      applyIsPostedRules: function () {
        oldApplyIsPostedRules.apply(this, arguments);
        this.setReadOnly("project", this.get("isPosted"));
      }

    });
  };

}());


