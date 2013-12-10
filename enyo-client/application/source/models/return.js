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

    idAttribute: 'number',

    numberPolicySetting: 'CMNumberGeneration',

    defaults: function () {
      return {
        returnDate: new Date(),
        isPosted: false,
        isVoid: false,
        commission: 0,
        taxTotal: 0,
        miscCharge: 0
      };
    },

    readOnlyAttributes: [
      "isPosted",
      "isVoid",
      "isPrinted",
      "miscCharge",
      "lineItems",
      "allocatedCredit",
      "authorizedCredit"
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

    idAttribute: 'uuid'

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

    couldDestroy: function (callback) {
      callback(XT.session.privileges.get("MaintainCreditMemos") && !this.get("isPosted"));
    },

    canPost: function (callback) {
      callback(XT.session.privileges.get("PostCreditMemos") && !this.get("isPosted"));
    },

    canVoid: function (callback) {
      var response = XT.session.privileges.get("VoidCreditMemos") && this.get("isPosted");
      callback(response || false);
    },

    // TODO: this.dispatch(this.editableModel...
    // TODO: write the function wrapper
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

    @extends XM.Characteristic
  */
  XM.ReturnCharacteristic = XM.CharacteristicAssignment.extend({
    /** @scope XM.ReturnCharacteristic.prototype */

    recordType: 'XM.ReturnCharacteristic',

    // TODO: verify this
    which: 'isCreditMemos'

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

    idAttribute: 'uuid',

    sellingUnits: undefined,

    parentKey: "return",

    readOnlyAttributes: [
      "lineNumber",
      "extendedPrice",
      "taxTotal"
    ],

    quantityAttribute: "quantity"

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
