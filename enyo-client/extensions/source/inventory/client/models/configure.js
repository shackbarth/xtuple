/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initSettings = function () {
    /**
      @class

      @extends XM.Settings
    */
    XM.Inventory = XM.Settings.extend(/** @lends XM.Inventory.Settings.prototype */ {

      recordType: 'XM.Inventory',

      privileges: 'ConfigureIN',

/*      validate: function (attributes, options) {
        // XXX not sure if number widgets can fail in this way.
        var params = { type: "_number".loc() };
        if (attributes.NextSalesOrderNumber !== undefined &&
            isNaN(attributes.NextSalesOrderNumber)) {
          params.attr = "_salesOrder".loc() + " " + "_number".loc();
          return XT.Error.clone('xt1003', { params: params });
        } else if (attributes.NextQuoteNumber &&
            isNaN(attributes.NextQuoteNumber)) {
          params.attr = "_quote".loc() + " " + "_number".loc();
          return XT.Error.clone('xt1003', { params: params });
        } else if (attributes.NextCreditMemoNumber &&
            isNaN(attributes.NextCreditMemoNumber)) {
          params.attr = "_creditMemo".loc() + " " + "_number".loc();
          return XT.Error.clone('xt1003', { params: params });
        } else if (attributes.NextInvoiceNumber &&
            isNaN(attributes.NextInvoiceNumber)) {
          params.attr = "_invoice".loc() + " " + "_number".loc();
          return XT.Error.clone('xt1003', { params: params });
        }
      }
*/ //from sales and I don't need it in Inventory - I will revisit this later
    });

    XM.inventory = new XM.Inventory();

  };

}());
