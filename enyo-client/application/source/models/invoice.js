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

  /**
    @class

    @extends XM.Characteristic
  */
  XM.InvoiceCharacteristic = XM.CharacteristicAssignment.extend({
    /** @scope XM.InvoiceCharacteristic.prototype */

    recordType: 'XM.InvoiceCharacteristic'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.InvoiceLine = XM.Model.extend({
    /** @scope XM.InvoiceLine.prototype */

    //
    // Attributes
    //
    recordType: 'XM.InvoiceLine',

    idAttribute: 'uuid',

    sellingUnits: undefined,

    //
    // Core functions
    //
    bindEvents: function (attributes, options) {
      XM.Model.prototype.bindEvents.apply(this, arguments);
      this.on("relational:change:item", this.itemDidChange); // TODO: shouldn't need this
      this.on("change:item", this.itemDidChange);
    },

    defaults: function () {
      return {
        site: XT.defaultSite()
      };
    },

    initialize: function (attributes, options) {
      XM.Model.prototype.initialize.apply(this, arguments);
      this.sellingUnits = new XM.UnitCollection();
    },

    //
    // Model-specific functions
    //
    calculatePrice: function () {

    },

    // temp until we refactor these together
    fetchSellingUnits: XM.SalesOrderLineBase.prototype.fetchSellingUnits,

    itemDidChange: function () {
      this.fetchSellingUnits();
    }



  });

  /**
    @class

    @extends XM.Model
  */
  XM.InvoiceLineTax = XM.Model.extend({
    /** @scope XM.InvoiceLineTax.prototype */

    recordType: 'XM.InvoiceLineTax',

    idAttribute: 'uuid'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.InvoiceContact = XM.Model.extend({
    /** @scope XM.InvoiceContact.prototype */

    recordType: 'XM.InvoiceContact',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.InvoiceAccount = XM.Model.extend({
    /** @scope XM.InvoiceAccount.prototype */

    recordType: 'XM.InvoiceAccount',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.InvoiceCustomer = XM.Model.extend({
    /** @scope XM.InvoiceCustomer.prototype */

    recordType: 'XM.InvoiceCustomer',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.InvoiceFile = XM.Model.extend({
    /** @scope XM.InvoiceFile.prototype */

    recordType: 'XM.InvoiceFile',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.InvoiceUrl = XM.Model.extend({
    /** @scope XM.InvoiceUrl.prototype */

    recordType: 'XM.InvoiceUrl',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.InvoiceItem = XM.Model.extend({
    /** @scope XM.InvoiceItem.prototype */

    recordType: 'XM.InvoiceItem',

    isDocumentAssignment: true

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
