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
    ],

    calculateTotals: function () {
      // TODO
    }

  });

  /**
    @class

    @extends XM.Model
  */
  XM.InvoiceTax = XM.Model.extend({
    /** @scope XM.InvoiceTax.prototype */

    recordType: 'XM.InvoiceTax',

    idAttribute: 'uuid'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.InvoiceAllocation = XM.Model.extend({
    /** @scope XM.InvoiceAllocation.prototype */

    recordType: 'XM.InvoiceAllocation',

    idAttribute: 'uuid'

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

    @extends XM.Info
  */
  XM.InvoiceRelation = XM.Info.extend({
    /** @scope XM.InvoiceRelation.prototype */

    recordType: 'XM.InvoiceRelation',

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

    parentKey: "invoice",

    //
    // Core functions
    //
    bindEvents: function (attributes, options) {
      XM.Model.prototype.bindEvents.apply(this, arguments);
      this.on("change:item", this.itemDidChange);
      this.on('change:priceUnit', this.priceUnitDidChange);
      this.on('change:quantityUnit', this.quantityUnitDidChange);
      this.on('change:' + this.parentKey, this.parentDidChange);
      this.on('change:isMiscellaneous', this.isMiscellaneousDidChange);

      this.isMiscellaneousDidChange();
    },

    defaults: function () {
      return {
        site: XT.defaultSite(),
        isMiscellaneous: false
      };
    },

    initialize: function (attributes, options) {
      XM.Model.prototype.initialize.apply(this, arguments);
      this.sellingUnits = new XM.UnitCollection();
    },

    //
    // Shared code with sales order
    // temp until we refactor these together
    //
    fetchSellingUnits: XM.SalesOrderLineBase.prototype.fetchSellingUnits,
    priceUnitDidChange: XM.SalesOrderLineBase.prototype.priceUnitDidChange,
    quantityUnitDidChange: XM.SalesOrderLineBase.prototype.quantityUnitDidChange,
    recalculateParent: XM.SalesOrderLineBase.prototype.recalculateParent,
    save: XM.SalesOrderLineBase.prototype.save,

    //
    // Model-specific functions
    //
    calculateExtendedPrice: function () {
    },
    calculatePrice: function () {
    },

    isMiscellaneousDidChange: function () {
      var isMisc = this.get("isMiscellaneous");
      if (isMisc) {
        //this.set({item: null}); ???
        this.setReadOnly("item", true);
        this.setReadOnly("itemNumber", false);
        this.setReadOnly("itemDescription", false);
        this.setReadOnly("salesCategory", false);
      } else {
        //this.set({itemNumber: null, itemDescription: null, salesCategory: null}); ???
        this.setReadOnly("item", false);
        this.setReadOnly("itemNumber", true);
        this.setReadOnly("itemDescription", true);
        this.setReadOnly("salesCategory", true);
      }
    },

    // refactor potential: this function is largely similar to the one on XM.SalesOrderLine
    itemDidChange: function () {
      //var isWholesaleCost = XT.session.settings.get("WholesalePriceCosting"),  not using this
      var that = this,
        options = {},
        parent = this.getParent(),
        taxZone = parent && parent.get("taxZone"),
        item = this.get("item"),
        unitCost = item && item.get("standardCost");

      // Reset values
      this.unset("priceUnitRatio");
      this.unset("taxType");
      this.fetchSellingUnits();

      if (!item) { return; }

      // Fetch and update tax type
      options.success = function (id) {
        var taxType = XM.taxTypes.get(id);
        if (taxType) {
          that.set("taxType", taxType);
        } else {
          that.unset("taxType");
        }
      };

      item.taxType(taxZone, options);

      this.calculatePrice();
    },
    //Refactor potential: this is similar to sales order line item, but
    // skips the scheduleDate calculations
    parentDidChange: function () {
      var parent = this.getParent(),
       lineNumber = this.get("lineNumber"),
       lineNumberArray,
       maxLineNumber;

      // Set next line number to be 1 more than the highest living model
      if (parent && !lineNumber) {
        lineNumberArray = _.compact(_.map(parent.get("lineItems").models, function (model) {
          return model.isDestroyed() ? null : model.get("lineNumber");
        }));
        maxLineNumber = lineNumberArray.length > 0 ? Math.max.apply(null, lineNumberArray) : 0;
        this.set("lineNumber", maxLineNumber + 1);
      }
    },
    // Refactor potential: this is like the one on sales order line base, but
    // checks billed as well, and validates isMiscellaneous
    validate: function () {
      var that = this,
        quantity = this.get("quantity"),
        billed = this.get("billed"),
        isMiscellaneous = this.get("isMiscellaneous"),
        extraRequiredFields,
        requiredFieldsError;

      // Check billed
      if ((billed || 0) <= 0) {
        return XT.Error.clone('xt2013'); // TODO: generalize error message
      }

      // Check quantity
      if ((quantity || 0) <= 0) {
        return XT.Error.clone('xt2013');
      }

      // Check order quantity against fractional setting
      if (!this._unitIsFractional &&
          (Math.round(quantity) !== quantity || Math.round(billed) !== billed)) {
        return XT.Error.clone('xt2014');
      }

      // Checks item values line up with isMiscellaneous
      extraRequiredFields = isMiscellaneous ? ["itemNumber", "itemDescription", "salesCategory"] : ["item"];

      _.each(extraRequiredFields, function (req) {
        var value = that.get(req),
          params = {recordType: that.recordType};

        if (value === undefined || value === null || value === "") {
          params.attr = ("_" + req).loc();
          requiredFieldsError = XT.Error.clone('xt1004', { params: params });
        }
      });
      if (requiredFieldsError) {
        return requiredFieldsError;

      }


      return XM.Document.prototype.validate.apply(this, arguments);
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

  /**
    @class

    @extends XM.Collection
  */
  XM.InvoiceRelationCollection = XM.Collection.extend({
    /** @scope XM.InvoiceRelationCollection.prototype */

    model: XM.InvoiceRelation

  });


}());
