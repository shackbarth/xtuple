/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global Globalize:true, XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.Invoice = XM.Document.extend({
    /** @scope XM.Invoice.prototype */

    recordType: 'XM.Invoice',

    documentKey: 'number',

    idAttribute: 'number',

    defaults: function () {
      return {
        invoiceDate: new Date(),
        isPosted: false,
        isVoid: false,
        isPrinted: false,
        commission: 0
      };
    },

    readOnlyAttributes: [
      "isPosted",
      "isVoid",
      "isPrinted"
    ]

  });

  /**
    @class

    @extends XM.Info
  */
  XM.InvoiceListItem = XM.Info.extend({
    /** @scope XM.InvoiceListItem.prototype */

    recordType: 'XM.InvoiceListItem',

    editableModel: 'XM.Invoice'

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.InvoiceListItemCollection = XM.Collection.extend({
    /** @scope XM.InvoiceListItemCollection.prototype */

    model: XM.InvoiceListItem

  });


}());
