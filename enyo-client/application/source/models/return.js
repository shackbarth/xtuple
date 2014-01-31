/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global Globalize:true, XT:true, XM:true, Backbone:true, _:true, console:true, async:true */

(function () {
  "use strict";


  /**
    @class

    @extends XM.Document
  */
  XM.Return = XM.Document.extend(_.extend({}, XM.InvoiceMixin, {
    /** @scope XM.Return.prototype */

    //
    // Attributes
    //
    recordType: 'XM.Return',

    documentKey: 'number',

    documentDateKey: 'returnDate',

    altQuantityAttribute: 'credited',

    idAttribute: 'number',

    numberPolicySetting: 'CMNumberGeneration',

    extraSubtotalFields: [],

    defaults: function () {
      return {
        returnDate: new Date(),
        isPosted: false,
        isVoid: false,
        commission: 0,
        taxTotal: 0,
        miscCharge: 0,
        balance: 0
      };
    },

    readOnlyAttributes: [
      "isPosted",
      "isVoid",
      "isPrinted",
      "lineItems",
      "allocatedCredit",
      "authorizedCredit",
      "balance",
      "margin",
      "status",
      "subtotal",
      "taxTotal",
      "total"
    ],

    // like sales order, minus contact info
    billtoAttrArray: [
      "billtoName",
      "billtoAddress1",
      "billtoAddress2",
      "billtoAddress3",
      "billtoCity",
      "billtoState",
      "billtoPostalCode",
      "billtoCountry"
    ]

  }));

  /**
    @class

    @extends XM.Model
  */
  XM.ReturnTax = XM.Model.extend({
    /** @scope XM.ReturnTax.prototype */

    recordType: 'XM.ReturnTax',

    idAttribute: 'uuid',

    // make up the the field that is "value"'ed in the ORM
    taxType: "Adjustment",

    bindEvents: function (attributes, options) {
      XM.Model.prototype.bindEvents.apply(this, arguments);
      this.on("change:amount", this.calculateTotalTax);
    },

    calculateTotalTax: function () {
      var parent = this.getParent();
      if (parent) {
        parent.calculateTotalTax();
      }
    }

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ReturnAllocation = XM.Model.extend({
    /** @scope XM.ReturnAllocation.prototype */

    recordType: 'XM.ReturnAllocation',

    idAttribute: 'uuid'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.ReturnListItem = XM.Info.extend({
    /** @scope XM.ReturnListItem.prototype */

    recordType: 'XM.ReturnListItem',

    editableModel: 'XM.Return',

    documentDateKey: 'returnDate',

    couldDestroy: function (callback) {
      callback(!this.get("isPosted"));
    },

    canPost: function (callback) {
      callback(!this.get("isPosted"));
    },

    canVoid: function (callback) {
      var response = this.get("isPosted");
      callback(response || false);
    },

    doPost: function (options) {
      this.dispatch("XM.Return", "post", [this.id], {
        success: options && options.success,
        error: options && options.error
      });
    },

    doVoid: function (options) {
      this.dispatch("XM.Return", "void", [this.id], {
        success: options && options.success,
        error: options && options.error
      });
    }

  });

  /**
    @class

    @extends XM.Info
  */
  XM.ReturnRelation = XM.Info.extend({
    /** @scope XM.ReturnRelation.prototype */

    recordType: 'XM.ReturnRelation',

    editableModel: 'XM.Return'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ReturnLine = XM.Model.extend(_.extend({}, XM.OrderLineMixin, XM.InvoiceLineMixin, {
    /** @scope XM.ReturnLine.prototype */

    //
    // Attributes
    //
    recordType: 'XM.ReturnLine',

    parentKey: "return",

    readOnlyAttributes: [
      "lineNumber",
      "extendedPrice",
      "taxTotal"
    ],

    altQuantityAttribute: "credited",

    defaults: function () {
      return {
        site: XT.defaultSite()
      };
    }


  }));

  /**
    @class

    @extends XM.Model
  */
  XM.ReturnLineTax = XM.Model.extend({
    /** @scope XM.ReturnLineTax.prototype */

    recordType: 'XM.ReturnLineTax',

    idAttribute: 'uuid'

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.ReturnListItemCollection = XM.Collection.extend({
    /** @scope XM.ReturnListItemCollection.prototype */

    model: XM.ReturnListItem

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ReturnRelationCollection = XM.Collection.extend({
    /** @scope XM.ReturnRelationCollection.prototype */

    model: XM.ReturnRelation

  });


}());
