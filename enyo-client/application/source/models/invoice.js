/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global Globalize:true, XT:true, XM:true, Backbone:true, _:true,
  console:true, async:true, window:true */

(function () {
  "use strict";

  /**
    This should only be called by `calculatePrice`.
    @private
  */
  var _calculatePrice = function (model) {
    var K = model.getClass(),
      item = model.get("item"),
      site = model.get("site"),
      priceUnit = model.get("priceUnit"),
      quantity = model.get(model.altQuantityAttribute),
      quantityUnit = model.get("quantityUnit"),
      readOnlyCache = model.isReadOnly("price"),
      parent = model.getParent(),
      asOf = parent.get(parent.documentDateKey),
      prices = [],
      itemOptions = {},
      parentDate,
      customer,
      currency,

      // Set price after we have item and all characteristics prices
      setPrice = function () {
        // Allow editing again if we could before
        model.setReadOnly("price", readOnlyCache);

        // If price was requested before this response,
        // then bail out and start over
        if (model._invalidPriceRequest) {
          delete model._invalidPriceRequest;
          delete model._pendingPriceRequest;
          _calculatePrice(model);
          return;
        }

        var totalPrice = XT.math.add(prices, XT.SALES_PRICE_SCALE);
        model.set({price: totalPrice});
        model.setIfExists({customerPrice: totalPrice});
        model.calculateExtendedPrice();
      };

    parentDate = parent.get(parent.documentDateKey);
    customer = parent.get("customer");
    currency = parent.get("currency");

    // If we already have a request pending we need to indicate
    // when that is done to start over because something has changed.
    if (model._pendingPriceRequest) {
      if (!model._invalidPriceRequest) {
        model._invalidPriceRequest = true;
      }
      return;
    }

    // Don't allow user editing of price until we hear back from the server
    model.setReadOnly("price", true);

    // Get the item price
    itemOptions.asOf = asOf;
    itemOptions.currency = currency;
    itemOptions.effective = parentDate;
    itemOptions.site = site;
    itemOptions.error = function (err) {
      model.trigger("invalid", err);
    };

    itemOptions.quantityUnit = quantityUnit;
    itemOptions.priceUnit = priceUnit;
    itemOptions.success = function (resp) {
      // Handle no price found scenario
      if (resp.price === -9999 && !model._invalidPriceRequest) {
        model.notify("_noPriceFound".loc(), { type: K.WARNING });
        model.unset("customerPrice");
        model.unset("price");
        model.unset(model.altQuantityAttribute);
        model.unset("quantity");

      // Handle normal scenario
      } else {
        if (!model._invalidPriceRequest) {
          //model.set("basePrice", resp.price);
          prices.push(resp.price);
        }
        setPrice();
      }
    };
    itemOptions.error = function (err) {
      model.trigger("error", err);
    };
    customer.itemPrice(item, quantity, itemOptions);
  };

  /**
    Function that actually does the calculation work.
    Taken largely from sales_order_base.
    @private
  */
  var _calculateTotals = function (model) {
    var miscCharge = model.get("miscCharge") || 0.0,
      scale = XT.MONEY_SCALE,
      add = XT.math.add,
      subtract = XT.math.subtract,
      subtotals = [],
      taxDetails = [],
      lineItemTaxDetails = [],
      adjustmentTaxDetails = [],
      subtotal,
      taxTotal = 0.0,
      taxModel,
      total,
      taxCodes;

    model.meta.get("taxes").reset([]);

    // Collect line item detail
    var forEachLineItemFunction = function (lineItem) {
      var extPrice = lineItem.get('extendedPrice') || 0,
        quantity = lineItem.get("quantity") || 0;

      subtotals.push(extPrice);
      taxDetails = taxDetails.concat(lineItem.get("taxes").models);
      lineItemTaxDetails = lineItemTaxDetails.concat(lineItem.get("taxes").models);
    };

    // Collect tax adjustment detail
    var forEachTaxAdjustmentFunction = function (taxAdjustment) {
      taxDetails = taxDetails.concat(taxAdjustment);
      adjustmentTaxDetails = adjustmentTaxDetails.concat(taxAdjustment);
    };

    // Line items should not include deleted.
    var lineItems = _.filter(model.get("lineItems").models, function (item) {
      return item.status !== XM.Model.DESTROYED_DIRTY;
    });

    _.each(lineItems, forEachLineItemFunction);
    _.each(model.get('taxAdjustments').models, forEachTaxAdjustmentFunction);

    //
    // Subtotal the tax detail for presentation in the view layer. The presentation
    // of the taxes are grouped first by line item / adjustment / freight, as opposed
    // to the rest of the calculation here which are first grouped by taxCode. So
    // the calculation has to be separate.
    //
    taxCodes = _.groupBy(lineItemTaxDetails, function (detail) {
      return detail.getValue("taxCode.code");
    });
    _.each(taxCodes, function (taxDetails, code) {
      var subtotal = _.reduce(taxDetails, function (memo, item) {
        return memo + item.get("amount");
      }, 0);
      taxModel = new XM.StaticModel({
        type: "_lineItems".loc(),
        code: code,
        currency: model.get("currency"),
        amount: subtotal
      });
      model.meta.get("taxes").add(taxModel);
    });

    // Total taxes
    // First group amounts by tax code
    taxCodes = _.groupBy(taxDetails, function (detail) {
      return detail.getValue("taxCode.code");
    });

    // Loop through each tax code group and subtotal
    _.each(taxCodes, function (group, key) {
      var taxes = [],
        subtotal;

      // Collect array of taxes
      _.each(group, function (detail) {
        taxes.push(detail.get("amount"));
      });

      // Subtotal first to make sure we round by subtotal
      subtotal = add(taxes, 6);

      // Now add to tax grand total
      taxTotal = add(taxTotal, subtotal, scale);
    });

    // Totaling calculations
    // First get additional subtotal attributes (i.e. freight) that were added outside of core
    if (model.extraSubtotalFields && model.extraSubtotalFields.length) {
      _.each(model.extraSubtotalFields, function (attr) {
        var attrVal = model.get(attr);
        subtotals.push(attrVal);
      });
    }

    subtotal = add(subtotals, scale);
    subtotals = subtotals.concat([miscCharge, taxTotal]);
    total = add(subtotals, scale);

    // Set values
    model.set({subtotal: subtotal, taxTotal: taxTotal, total: total});
    model.trigger("refreshView", model);
  };

  XM.InvoiceMixin = {

    //
    // Core functions
    //
    bindEvents: function (attributes, options) {
      XM.Document.prototype.bindEvents.apply(this, arguments);
      this.on("change:customer", this.customerDidChange);
      this.on('add:lineItems remove:lineItems', this.lineItemsDidChange);
      this.on("change:" + this.documentDateKey + " add:taxAdjustments", this.setTaxAllocationDate);
      this.on("change:" + this.documentDateKey + " change:currency", this.calculateOutstandingCredit);
      this.on("change:" + this.documentDateKey + " change:currency", this.calculateAuthorizedCredit);
      this.on("change:" + this.documentDateKey + " add:allocations remove:allocations",
        this.calculateAllocatedCredit);
      this.on("add:lineItems remove:lineItems change:lineItems change:subtotal" +
        "change:taxTotal change:miscCharge", this.calculateTotals);
      this.on("change:taxZone add:taxAdjustments remove:taxAdjustments", this.calculateTotalTax);
      this.on("change:taxZone", this.recalculateTaxes);
      this.on("change:total change:allocatedCredit change:outstandingCredit",
        this.calculateBalance);
      this.on('allocatedCredit', this.allocatedCreditDidChange);
      this.on('statusChange', this.statusDidChange);
    },

    initialize: function (attributes, options) {
      XM.Document.prototype.initialize.apply(this, arguments);
      this.meta = new Backbone.Model();
      this.meta.set({taxes: new Backbone.Collection()});
    },

    //
    // Model-specific functions
    //
    allocatedCreditDidChange: function () {
      this.setCurrencyReadOnly();
    },

    // Refactor potential: sales_order_base minus shipto stuff minus prospect stuff
    applyCustomerSettings: function () {
      var customer = this.get("customer"),
        isFreeFormBillto = customer ? customer.get("isFreeFormBillto") : false;

      this.setReadOnly("lineItems", !customer);

      // Set read only state for free form billto
      this.setReadOnly(this.billtoAttrArray, !isFreeFormBillto);
    },

    applyIsPostedRules: function () {
      var isPosted = this.get("isPosted");

      this.setReadOnly(["lineItems", "number", this.documentDateKey, "salesRep", "commission",
        "taxZone", "saleType", "taxAdjustments", "miscCharge"], isPosted);

      if (_.contains(this.getAttributeNames(), "terms")) {
        this.setReadOnly("terms", isPosted);
      }
    },

    /**
      Add up the allocated credit. Only complicated because the reduce has
      to happen asynchronously due to currency conversion
    */
    calculateAllocatedCredit: function () {
      var invoiceCurrency = this.get("currency"),
        that = this,
        allocationsWithCurrency = _.filter(this.get("allocations").models, function (allo) {
          return allo.get("currency");
        }),
        reduceFunction = function (memo, allocationModel, callback) {
          allocationModel.get("currency").toCurrency(
            invoiceCurrency,
            allocationModel.get("amount"),
            new Date(),
            {
              success: function (targetValue) {
                callback(null, memo + targetValue);
              }
            }
          );
        },
        finish = function (err, totalAllocatedCredit) {
          that.set("allocatedCredit", totalAllocatedCredit);
        };

      async.reduce(allocationsWithCurrency, 0, reduceFunction, finish);
    },

    calculateAuthorizedCredit: function () {
      var that = this,
        success = function (resp) {
          that.set({authorizedCredit: resp});
          that.calculateBalance();
        };

      this.dispatch("XM.Invoice", "authorizedCredit", [this.id], {success: success});
    },

    calculateBalance: function () {
      var rawBalance = this.get("total") -
          this.get("allocatedCredit") -
          this.get("authorizedCredit") -
          this.get("outstandingCredit"),
        balance = Math.max(0, rawBalance);

      this.set({balance: balance});
    },

    calculateOutstandingCredit: function () {
      var that = this,
        success = function (resp) {
          that.set({outstandingCredit: resp});
        },
        error = function (resp) {
          // not a valid request
          that.set({outstandingCredit: null});
        };

      if (!this.get("customer")) {
        // don't bother if there's no customer
        return;
      }

      this.dispatch("XM.Invoice", "outstandingCredit",
        [this.getValue("customer.number"),
          this.getValue("currency.abbreviation"),
          this.getValue(this.documentDateKey)],
        {success: success, error: error});
    },

    calculateTotals: function () {
      _calculateTotals(this);
    },

    // XXX just calculate all the totals
    calculateTotalTax: function () {
      this.calculateTotals();
    },

    // Refactor potential: taken largely from sales_order_base
    customerDidChange: function (model, value, options) {
      var customer = this.get("customer"),
        billtoContact = customer && customer.get("billingContact"),
        billtoAddress = billtoContact && billtoContact.get("address"),
        billtoAttrs,
        that = this,
        unsetBilltoAddress = function () {
          that.unset("billtoName")
              .unset("billtoAddress1")
              .unset("billtoAddress2")
              .unset("billtoAddress3")
              .unset("billtoCity")
              .unset("billtoState")
              .unset("billtoPostalCode")
              .unset("billtoCountry");
        };

      this.applyCustomerSettings();

      // Set customer default data
      if (customer) {
        billtoAttrs = {
          billtoName: customer.get("name"),
          salesRep: customer.get("salesRep"),
          commission: customer.get("commission"),
          taxZone: customer.get("taxZone"),
          currency: customer.get("currency") || this.get("currency")
        };
        if (_.contains(this.getAttributeNames(), "terms")) {
          billtoAttrs.terms = customer.get("terms");
        }
        if (_.contains(this.getAttributeNames(), "billtoPhone")) {
          billtoAttrs.billtoPhone = billtoContact && billtoContact.getValue("phone");
        }
        if (billtoAddress) {
          _.extend(billtoAttrs, {
            billtoAddress1: billtoAddress.getValue("line1"),
            billtoAddress2: billtoAddress.getValue("line2"),
            billtoAddress3: billtoAddress.getValue("line3"),
            billtoCity: billtoAddress.getValue("city"),
            billtoState: billtoAddress.getValue("state"),
            billtoPostalCode: billtoAddress.getValue("postalCode"),
            billtoCountry: billtoAddress.getValue("country"),
          });
        } else {
          unsetBilltoAddress();
        }
        this.set(billtoAttrs);
      } else {
        unsetBilltoAddress();
        this.unset("salesRep")
            .unset("commission")
            .unset("terms")
            .unset("taxZone")
            .unset("shipVia")
            .unset("currency")
            .unset("billtoPhone");

      }
    },

    lineItemsDidChange: function () {
      var lineItems = this.get("lineItems");
      this.setCurrencyReadOnly();
      this.setReadOnly("customer", lineItems.length > 0);
    },

    /**
      Re-evaluate taxes for all line items
    */
    recalculateTaxes: function () {
      _.each(this.get("lineItems").models, function (lineItem) {
        lineItem.calculateTax();
      });
    },

    /**
      Set the currency read-only if there is allocated credit OR line items.
      I believe SalesOrderBase has a bug in not considering both these
      conditions at the same time.
    */
    setCurrencyReadOnly: function () {
      var lineItems = this.get("lineItems");
      this.setReadOnly("currency", lineItems.length > 0 || this.get("allocatedCredit"));
    },

    /**
      The document date on any misc tax adjustments should be the invoice date
    */
    setTaxAllocationDate: function () {
      var documentDate = this.get(this.documentDateKey);
      _.each(this.get("taxAdjustments").models, function (taxAdjustment) {
        taxAdjustment.set({documentDate: documentDate});
      });
    },

    statusDidChange: function () {
      var status = this.getStatus();
      XM.SalesOrderBase.prototype.statusDidChange.apply(this, arguments);
      if (status === XM.Model.READY_CLEAN) {
        this.applyIsPostedRules();
        this.allocatedCreditDidChange();
      }
    },

    // very similar to sales order, but minus shipto and prospect checks
    validate: function () {
      var customer = this.get("customer"),
        total = this.get("total"),
        lineItems = this.get("lineItems"),
        validItems,
        error;

      error = XM.Document.prototype.validate.apply(this, arguments);
      if (error) { return error; }

      if (total < 0) {
        return XT.Error.clone('xt2011');
      }

      // Check for line items has to consider models that
      // are marked for deletion, but not yet saved.
      // The prevStatus is used because the current
      // status is BUSY_COMMITTING once save has begun.
      validItems = _.filter(lineItems.models, function (item) {
        return item._prevStatus !== XM.Model.DESTROYED_DIRTY;
      });

      if (!validItems.length) {
        return XT.Error.clone('xt2012');
      }

      return;
    }

  };

  /**
    @class

    @extends XM.Document
  */
  XM.Invoice = XM.Document.extend(_.extend({}, XM.InvoiceMixin, {
    /** @scope XM.Invoice.prototype */

    //
    // Attributes
    //
    recordType: 'XM.Invoice',

    documentKey: 'number',

    documentDateKey: 'invoiceDate',

    altQuantityAttribute: 'billed',

    idAttribute: 'number',

    numberPolicySetting: 'InvcNumberGeneration',

    extraSubtotalFields: [],

    defaults: function () {
      return {
        invoiceDate: new Date(),
        isPosted: false,
        isVoid: false,
        isPrinted: false,
        commission: 0,
        taxTotal: 0,
        miscCharge: 0,
        subtotal: 0,
        total: 0,
        balance: 0,
        authorizedCredit: 0
      
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
      "billtoCountry",
      "billtoPhone",
    ]

  }));

  /**
    @class

    @extends XM.Model
  */
  XM.InvoiceTax = XM.Model.extend({
    /** @scope XM.InvoiceTax.prototype */

    recordType: 'XM.InvoiceTax',

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

    editableModel: 'XM.Invoice',

    documentDateKey: 'invoiceDate',

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
      this.dispatch("XM.Invoice", "post", [this.id], {
        success: options && options.success,
        error: options && options.error
      });
    },

    doVoid: function (options) {
      this.dispatch("XM.Invoice", "void", [this.id], {
        success: options && options.success,
        error: options && options.error
      });
    }

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

    recordType: 'XM.InvoiceCharacteristic',

    which: 'isInvoices'

  });

  XM.InvoiceLineMixin = {

    idAttribute: 'uuid',

    sellingUnits: undefined,

    readOnlyAttributes: [
      "lineNumber",
      "extendedPrice",
      "taxTotal",
      "customerPrice"
    ],

    //
    // Core functions
    //
    bindEvents: function (attributes, options) {
      XM.Model.prototype.bindEvents.apply(this, arguments);
      this.on("change:item", this.itemDidChange);
      this.on("change:" + this.altQuantityAttribute, this.quantityChanged);
      this.on('change:price', this.priceDidChange);
      this.on('change:priceUnit', this.priceUnitDidChange);
      this.on('change:quantityUnit', this.quantityUnitDidChange);
      this.on('change:' + this.parentKey, this.parentDidChange);
      this.on('change:taxType', this.calculateTax);
      this.on('change:isMiscellaneous', this.isMiscellaneousDidChange);

      this.isMiscellaneousDidChange();
    },

    initialize: function (attributes, options) {
      XM.Model.prototype.initialize.apply(this, arguments);
      this.sellingUnits = new XM.UnitCollection();
    },

    //
    // Model-specific functions
    //

    // XXX with the uncommented stuff back in, it's identical to the one in salesOrderBase
    /**
      Calculates and sets the extended price.

      returns {Object} Receiver
    */
    calculateExtendedPrice: function () {
      var billed = this.get(this.altQuantityAttribute) || 0,
        quantityUnitRatio = this.get("quantityUnitRatio"),
        priceUnitRatio = this.get("priceUnitRatio"),
        price = this.get("price") || 0,
        extPrice =  (billed * quantityUnitRatio / priceUnitRatio) * price;
      extPrice = XT.toExtendedPrice(extPrice);
      this.set("extendedPrice", extPrice);
      this.calculateTax();
      this.recalculateParent();
      return this;
    },

    /**
      Calculate the price for this line item

      @param{Boolean} force - force the net price to update, even if settings indicate not to.
      @returns {Object} Receiver
    */
    calculatePrice: function (force) {
      var settings = XT.session.settings,
        K = this.getClass(),
        that = this,
        canUpdate = this.canUpdate(),
        item = this.get("item"),
        priceUnit = this.get("priceUnit"),
        priceUnitRatio = this.get("priceUnitRatio"),
        quantity = this.get(this.altQuantityAttribute),
        quantityUnit = this.get("quantityUnit"),
        updatePolicy = settings.get("UpdatePriceLineEdit"),
        parent = this.getParent(),
        customer = parent ? parent.get("customer") : false,
        currency = parent ? parent.get("currency") :false,
        listPrice;

      // If no parent, don't bother
      if (!parent) { return; }

      // Make sure we have necessary values
      if (canUpdate && customer && currency &&
          item && quantity && quantityUnit &&
          priceUnit && priceUnitRatio &&
          parent.get(parent.documentDateKey)) {

        _calculatePrice(this);
      }
      return this;
    },

    calculateTax: function () {
      var parent = this.getParent(),
        amount = this.get("extendedPrice"),
        taxTypeId = this.getValue("taxType.id"),
        recordType,
        taxZoneId,
        effective,
        currency,
        processTaxResponses,
        that = this,
        options = {},
        params,
        taxTotal = 0.00,
        taxesTotal = [];

      // If no parent, don't bother
      if (!parent) { return; }

      recordType = parent.recordType;
      taxZoneId = parent.getValue("taxZone.id");
      effective = parent.get(parent.documentDateKey);
      currency = parent.get("currency");

      if (effective && currency && amount) {
        params = [taxZoneId, taxTypeId, effective, currency.id, amount];
        processTaxResponses = function (responses) {
          var processTaxResponse = function (resp, callback) {
            var setTaxModel = function () {
              taxModel.off("change:uuid", setTaxModel);
              taxModel.set({
                taxType: that.get("taxType"),
                taxCode: resp.taxCode.code,
                amount: resp.tax
              });
              that.get("taxes").add(taxModel);
              taxesTotal.push(resp.tax);
              callback();
            };
            var taxModel = new XM.InvoiceLineTax();
            taxModel.on("change:uuid", setTaxModel);
            taxModel.initialize(null, {isNew: true});
          };
          var finish = function () {
            that.recalculateParent(false);
          };
          that.get("taxes").reset(); // empty it out so we can populate it

          async.map(responses, processTaxResponse, finish);
          taxTotal = XT.math.add(taxesTotal, XT.COST_SCALE);
          that.set("taxTotal", taxTotal);
        };
        options.success = processTaxResponses;
        this.dispatch("XM.Tax", "taxDetail", params, options);
      }
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

    priceDidChange: function () {
      this.calculateExtendedPrice();
    }

  };

  /**
    @class

    @extends XM.Model
  */
  XM.InvoiceLine = XM.Model.extend(_.extend({}, XM.OrderLineMixin, XM.InvoiceLineMixin, {
    /** @scope XM.InvoiceLine.prototype */

    //
    // Attributes
    //
    recordType: 'XM.InvoiceLine',

    parentKey: "invoice",

    altQuantityAttribute: "billed",

    defaults: function () {
      return {
        site: XT.defaultSite(),
        isMiscellaneous: false
      };
    }

  }));

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
