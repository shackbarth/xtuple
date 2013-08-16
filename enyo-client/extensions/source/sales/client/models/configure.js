/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.sales.initSettings = function () {
    /**
      @class

      @extends XM.Settings
    */
    XM.Sales = XM.Settings.extend(/** @lends XM.Sales.Settings.prototype */ {

      recordType: 'XM.Sales',

      privileges: 'ConfigureSO',

      bindEvents: function () {
        XM.Settings.prototype.bindEvents.apply(this, arguments);
        this.on('statusChange', this.statusDidChange);
      },

      statusDidChange: function () {
        // extensions might want to inject business logic in here
      },

      validate: function (attributes, options) {
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
    });

    XM.sales = new XM.Sales();

  };

}());
