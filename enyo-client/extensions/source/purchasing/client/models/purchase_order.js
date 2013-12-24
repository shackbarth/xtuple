/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

(function () {
  "use strict";

  XT.extensions.purchasing.initPurchaseOrderModels = function () {

    /**
      @class

      @extends XM.Model
    */
    XM.PurchaseType = XM.Model.extend({

      recordType: "XM.PurchaseType",

      defaults: {
        isActive: true
      }

    });

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.PurchaseTypeCharacteristic = XM.CharacteristicAssignment.extend(/** @lends XM.PurchaseTypeCharacteristic.prototype */{

      recordType: "XM.PurchaseTypeCharacteristic",

      which: "isPurchaseOrders"

    });

    /**
      @class

      @extends XM.WorkflowSource
    */
    XM.PurchaseTypeWorkflow = XM.WorkflowSource.extend({

      recordType: "XM.PurchaseTypeWorkflow"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.PurchaseEmailProfile = XM.Model.extend(/** @lends XM.PurchaseEmail.prototype */{

      recordType: "XM.PurchaseEmailProfile"

    });

    XM.PurchaseOrderMixin = {
      /**
        Returns Purchase order status as a localized string.

        @returns {String}
      */
      getPurchaseOrderStatusString: function () {
        var K = XM.PurchaseOrder,
          status = this.get("status");

        switch (status)
        {
        case K.UNRELEASED_STATUS:
          return "_unreleased".loc();
        case K.OPEN_STATUS:
          return "_open".loc();
        case K.CLOSED_STATUS:
          return "_closed".loc();
        }
      }
    };

    /**
      @class

      @extends XM.Document
    */
    XM.PurchaseOrder = XM.Document.extend({

      recordType: "XM.PurchaseOrder",

      documentKey: "number",

      numberPolicySetting: "PONumberGeneration",

      defaults: function () {
        var agent = XM.agents.find(function (agent) {
            return agent.id === XM.currentUser.id;
          });
        return {
          orderDate: XT.date.today(),
          status: XM.PurchaseOrder.UNRELEASED_STATUS,
          currency: XT.baseCurrency(),
          site: XT.defaultSite(),
          agent: agent ? agent.id : null
        };
      },

      readOnlyAttributes: [
        "freightSubtotal",
        "lineItems",
        "releaseDate",
        "status",
        "subtotal",
        "taxTotal",
        "total"
      ],

      handlers: {
        "add:lineItems remove:lineItems": "lineItemsChanged",
        "change:freight": "calculateFreightTax",
        "change:purchaseType": "purchaseTypeChanged",
        "change:site": "siteChanged",
        "change:status": "purchaseOrderStatusChanged",
        "change:taxZone": "recalculateTaxes",
        "change:vendor": "vendorChanged",
        "change:vendorAddress": "vendorAddressChanged"
      },

      taxDetail: undefined,

      freightTaxDetail: undefined,

      calculateFreightTax: function () {
        var amount = this.get("freight"),
          taxType = _.where(_.pluck(XM.taxTypes.models, "attributes"), {name: "Freight"})[0],
          taxTypeId = taxType.id,
          taxZoneId = this.getValue("taxZone.id"),
          effective = this.get("orderDate"),
          currency = this.get("currency"),
          that = this,
          dispOptions = {},
          params;

        if (effective && currency && amount) {
          params = [taxZoneId, taxTypeId, effective, currency.id, amount];
          dispOptions.success = function (resp) {
            that.freightTaxDetail = resp;
            that.calculateTotals();
          };
          this.dispatch("XM.Tax", "taxDetail", params, dispOptions);
        }
        return this;
      },

      calculateTotals: function () {
        var freight = this.get("freight") || 0.0,
          scale = XT.MONEY_SCALE,
          add = XT.math.add,
          subtract = XT.math.subtract,
          subtotals = [],
          taxDetails = [],
          costs = [],
          freightSubtotals = [],
          subtotal,
          freightSubtotal,
          taxTotal = 0.0,
          total,
          taxCodes;

        // Collect line item detail
        var forEachCalcFunction = function (lineItem) {
          var extPrice = lineItem.get("extendedPrice") || 0,
            quantity = lineItem.get("quantity") || 0,
            freight = lineItem.get("freight") || 0,
            item = lineItem.get("item"),
            quantityUnitRatio = lineItem.get("quantityUnitRatio");

          subtotals.push(extPrice);
          freightSubtotals.push(freight);
          taxDetails = taxDetails.concat(lineItem.taxDetail);
        };

        _.each(this.get("lineItems").models, forEachCalcFunction);

        // Add freight taxes to the mix
        taxDetails = taxDetails.concat(this.freightTaxDetail);

        // Total taxes
        // First group amounts by tax code
        taxCodes = _.groupBy(taxDetails, function (detail) {
          return detail.taxCode.id;
        });

        // Loop through each tax code group and subtotal
        _.each(taxCodes, function (group) {
          var taxes = [],
            subtotal;

          // Collect array of taxes
          _.each(group, function (detail) {
            taxes.push(detail.tax);
          });

          // Subtotal first to make sure we round by subtotal
          subtotal = add(taxes, 6);

          // Now add to tax grand total
          taxTotal = add(taxTotal, subtotal, scale);
        });

        // Totaling calculations
        freightSubtotal = add(freightSubtotals, scale);
        subtotal = add(subtotals, scale);
        subtotals = subtotals.concat([freightSubtotal, freight, taxTotal]);
        total = add(subtotals, scale);

        // Set values
        this.set("freightSubtotal", freightSubtotal);
        this.set("subtotal", subtotal);
        this.set("taxTotal", taxTotal);
        this.set("total", total);
      },

      initialize: function (attributes, options) {
        XM.Document.prototype.initialize.apply(this, arguments);
        if (XT.session.settings.get("RequirePOTax")) {
          this.requiredAttributes.push("taxZone");
        }
        this.taxDetail = [];
        this.freightTaxDetail = [];
      },

      vendorChanged: function () {
        var vendor = this.get("vendor"),
          vendorAddress = vendor ? vendor.get("vendorAddress") : false,
          address = vendorAddress ? vendorAddress.getValue("address") : false,
          contact = vendor ? vendor.get("primaryContact") : false,
          attrs = {
            vendorAddress: null,
            vendorCountry: ""
          },
          K = XM.Vendor,
          source;

        if (vendor) {
          source = vendor.get("incotermsSource") === K.INCOTERMS_VENDOR ?
            vendor : this.get("site");
          attrs.incoterms = source.get("incoterms");
          attrs.currency = vendor.get("currency");
          attrs.terms = vendor.get("terms");
          attrs.taxZone = vendor.get("taxZone");
          attrs.shipVia = vendor.get("shipVia");
          attrs.vendorAddress = vendorAddress;
        }

        this.set(attrs);
        this.setReadOnly("lineItems", !vendor);
      },

      vendorAddressChanged: function () {
        var vendorAddress = this.get("vendorAddress"),
          address = vendorAddress ? vendorAddress.get("address"): false,
          contact = vendorAddress ? vendorAddress.get("contact") : false,
          attrs = {
            vendorAddress1: "",
            vendorAddress2: "",
            vendorAddress3: "",
            vendorCity: "",
            vendorState: "",
            vendorPostalCode: "",
            vendorCountry: "",
            vendorContact: null,
            vendorContactHonorific: "",
            vendorContactFirstName: "",
            vendorContactLastName: "",
            vendorContactMiddle: "",
            vendorContactSuffix: "",
            vendorContactTitle: "",
            vendorContactPhone: "",
            vendorContactFax: "",
            vendorContactEmail: ""
          };

        if (address) {
          attrs.vendorAddress1 = address.get("line1");
          attrs.vendorAddress2 = address.get("line2");
          attrs.vendorAddress3 = address.get("line3");
          attrs.vendorCity = address.get("city");
          attrs.vendorState = address.get("state");
          attrs.vendorPostalCode = address.get("postalCode");
          attrs.vendorCountry = address.get("country");
        }

        if (contact) {
          attrs.vendorContact = contact;
          attrs.vendorContactHonorific = contact.get("honorific");
          attrs.vendorContactFirstName = contact.get("firstName");
          attrs.vendorContactLastName = contact.get("lastName");
          attrs.vendorContactMiddle = contact.get("middle");
          attrs.vendorContactSuffix = contact.get("suffix");
          attrs.vendorContactTitle = contact.get("title");
          attrs.vendorContactPhone = contact.get("phone");
          attrs.vendorContactFax = contact.get("fax");
          attrs.vendorContactEmail = contact.get("primaryEmail");
        }

        this.set(attrs);
      },

      lineItemsChanged: function () {
        var hasLineItems = this.get("lineItems").length > 0;
        this.setReadOnly(["vendor", "currency"], hasLineItems);
        this.setReadOnly("status", !hasLineItems);
        if (!hasLineItems) {
          this.set("status", XM.PurchaseOrder.UNRELEASED_STATUS);
        }
        this.calculateTotals();
      },

      purchaseOrderStatusChanged: function () {
        var status = this.get("status"),
          lineItems = this.get("lineItems");

        lineItems.each(function (lineItem) {
          var quantity = lineItem.get("quantity");
          if (status === XM.PurchaseOrder.CLOSED_STATUS ||
              lineItem.get("received") < quantity) {
            lineItem.set("status", status);
          }
        });
      },

      purchaseTypeChanged: function () {
        this.inheritWorkflowSource(
          this.get("purchaseType"),
          "XM.PurchaseOrderCharacteristic",
          "XM.PurchaseOrderWorkflow"
        );
      },

      /**
        Re-evaluate taxes for all line items and freight.
      */
      recalculateTaxes: function () {
        _.each(this.get("lineItems").models, function (lineItem) {
          lineItem.calculateTax();
        });
        this.calculateFreightTax();
      },

      siteChanged: function () {
        var site = this.get("site"),
          address = site ? site.get("address"): false,
          contact = site ? site.get("contact") : false,
          attrs = {
            shiptoAddress: null,
            shiptoAddress1: "",
            shiptoAddress2: "",
            shiptoAddress3: "",
            shiptoCity: "",
            shiptoState: "",
            shiptoPostalCode: "",
            shiptoCountry: "",
            shiptoContact: null,
            shiptoContactHonorific: "",
            shiptoContactFirstName: "",
            shiptoContactLastName: "",
            shiptoContactMiddle: "",
            shiptoContactSuffix: "",
            shiptoContactTitle: "",
            shiptoContactPhone: "",
            shiptoContactFax: "",
            shiptoContactEmail: ""
          };

        if (address) {
          attrs.shiptoAddress = address;
          attrs.shiptoAddress1 = address.get("line1");
          attrs.shiptoAddress2 = address.get("line2");
          attrs.shiptoAddress3 = address.get("line3");
          attrs.shiptoCity = address.get("city");
          attrs.shiptoState = address.get("state");
          attrs.shiptoPostalCode = address.get("postalCode");
          attrs.shiptoCountry = address.get("country");
        }

        if (contact) {
          attrs.shiptoContact = contact;
          attrs.shiptoContactHonorific = contact.get("honorific");
          attrs.shiptoContactFirstName = contact.get("firstName");
          attrs.shiptoContactLastName = contact.get("lastName");
          attrs.shiptoContactMiddle = contact.get("middle");
          attrs.shiptoContactSuffix = contact.get("suffix");
          attrs.shiptoContactTitle = contact.get("title");
          attrs.shiptoContactPhone = contact.get("phone");
          attrs.shiptoContactFax = contact.get("fax");
          attrs.shiptoContactEmail = contact.get("primaryEmail");
        }

        this.set(attrs);
      },

      statusDidChange: function () {
        XM.Document.prototype.statusDidChange.apply(this, arguments);
        var status = this.getStatus(),
          K = XM.Model,
          lineCount;
        if (status === K.READY_NEW) {
          this.siteChanged();
        } else if (status === K.READY_CLEAN) {
          this.setReadOnly("lineItems", false);
          this.setReadOnly(["number", "orderDate", "site", "vendor"]);
        }
      },

      validate: function () {
        var err = XM.Document.prototype.validate.apply(this, arguments),
          lineItems = this.get("lineItems"),
          status = this.get("status"),
          K = XM.PurchaseOrder,
          validItems;

        // Check that we have line items
        if (!err) {
          validItems = _.filter(lineItems.models, function (item) {
            return item.previousStatus() !== K.DESTROYED_DIRTY;
          });

          if (!validItems.length) {
            return XT.Error.clone("xt2012");
          }
        }

        // Check for valid po status
        if (status === K.UNRELEASED_STATUS) {
          lineItems.each(function (item) {
            if (item.get("toReceive") ||
                item.get("received") ||
                item.get("vouchered")) {
              err = XT.Error.clone("xt2025");
            }
          });
        }

        return err;
      }

    });

    XM.PurchaseOrder = XM.PurchaseOrder.extend(XM.PurchaseOrderMixin);
    XM.PurchaseOrder = XM.PurchaseOrder.extend(XM.WorkflowMixin);
    XM.PurchaseOrder = XM.PurchaseOrder.extend(XM.EmailSendMixin);
    XM.PurchaseOrder = XM.PurchaseOrder.extend({
      emailDocumentName: "_purchaseOrder".loc(),
      emailProfileAttribute: "purchaseType.emailProfile",
      emailStatusMethod: "getPurchaseOrderStatusString"
    });

    // ..........................................................
    // CONSTANTS
    //
    _.extend(XM.PurchaseOrder, /** @lends XM.PurchaseOrder# */{

      /**
        Order is unreleased.

        @static
        @constant
        @type String
        @default U
      */
      UNRELEASED_STATUS: "U",

      /**
        Order is open.

        @static
        @constant
        @type String
        @default O
      */
      OPEN_STATUS: "O",

      /**
        Order is closed.

        @static
        @constant
        @type String
        @default C
      */
      CLOSED_STATUS: "C"

    });

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.PurchaseOrderCharacteristic = XM.CharacteristicAssignment.extend(/** @lends XM.PurchaseOrderCharacteristic.prototype */{

      recordType: "XM.PurchaseOrderCharacteristic",

      which: "isPurchaseOrders"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.PurchaseOrderComment = XM.Comment.extend({

      recordType: "XM.PurchaseOrderComment",

      sourceName: "P"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.PurchaseOrderWorkflow = XM.Workflow.extend(/** @lends XM.PurchaseOrderWorkflow.prototype */{

      recordType: "XM.PurchaseOrderWorkflow",

      getPurchaseOrderWorkflowStatusString: function () {
        return XM.PurchaseOrderWorkflow.prototype.getWorkflowStatusString.call(this);
      }

    });

    _.extend(XM.PurchaseOrderWorkflow, /** @lends XM.PurchaseOrderWorkflow# */{

      TYPE_OTHER: "O"

    });


    /**
      @class

      @extends XM.Model
    */
    XM.PurchaseOrderLine = XM.Model.extend({

      recordType: "XM.PurchaseOrderLine",

      defaults: function () {
        return {
          isMiscellaneous: false,
          received: 0,
          toReceive: 0,
          unitCost: 0
        };
      },

      readOnlyAttributes: [
        "expenseCategory",
        "extendedPrice",
        "lineNumber",
        "received",
        "returned",
        "status",
        "toReceive",
        "unitCost",
        "vendorUnit",
        "vendorUnitRatio",
        "vouchered"
      ],

      handlers: {
        "statusChange": "statusChanged",
        "change:expenseCategory": "isMiscellaneousChanged",
        "change:freight": "calculateTax",
        "change:item": "itemChanged",
        "change:itemSource": "itemSourceChanged",
        "change:isMiscellaneous": "isMiscellaneousChanged",
        "change:price": "calculateExtendedPrice",
        "change:purchaseOrder": "purchaseOrderChanged",
        "change:quantity change:site": "calculatePrice"
      },

      taxDetail: null,

      calculateExtendedPrice: function () {
        var quantity = this.get("quantity") || 0,
          price = this.get("price") || 0,
          purchaseOrder = this.get("purchaseOrder");
        this.set("extendedPrice", quantity * price);
        if (purchaseOrder) { purchaseOrder.calculateTotals(); }
      },

      calculatePrice: function () {
        var itemSource = this.get("itemSource"),
          item = this.get("item"),
          site = this.get("site"),
          quantity = this.get("quantity") || 0,
          price = 0;

        if (itemSource) {
          price = itemSource.calculatePrice(quantity, site);
        }
        this.set("price", price);
      },

      calculateTax: function () {
        var purchaseOrder = this.get("purchaseOrder"),
          amount = this.get("extendedPrice"),
          freight = this.get("freight"),
          taxTypeId = this.getValue("taxType.id"),
          taxZoneId,
          effective,
          currencyId,
          that = this,
          options = {},
          params,
          count = 0,
          tax = 0;

        // If no parent, don't bother
        if (!purchaseOrder) { return; }

        taxZoneId = purchaseOrder.getValue("taxZone.id");
        effective = purchaseOrder.get("orderDate");
        currencyId = purchaseOrder.getValue("currency.id");

        if (effective && currencyId && (amount || freight)) {
          this.taxDetail = [];
          options.success = function (resp) {
            count--;
            that.taxDetail = that.taxDetail.concat(resp);
            if (resp.length) {
              tax = XT.math.add(_.pluck(resp, "tax"), 6);
            }

            if (count === 0) {
              that.set("tax", XT.math.round(tax, XT.PURCHASE_PRICE_SCALE));
              purchaseOrder.calculateTotals();
            }
          };
          if (amount) { count++; }
          if (freight) { count++; }
          if (amount) {
            params = [taxZoneId, taxTypeId, effective, currencyId, amount];
            this.dispatch("XM.Tax", "taxDetail", params, options);
          }
          if (freight) {
            taxTypeId = _.where(_.pluck(XM.taxTypes.models, "attributes"), {name: "Freight"})[0].id;
            params = [taxZoneId, taxTypeId, effective, currencyId, freight];
            this.dispatch("XM.Tax", "taxDetail", params, options);
          }
        } else {
          this.set("tax", tax);
        }
      },

      destroy: function (options) {
        var status = this.getParent().get("status"),
          K = XM.PurchaseOrder,
          that = this,
          payload = {
            type: K.QUESTION,
          },
          args = arguments,
          message;

        if (status === K.UNRELEASED_STATUS) {
          message = "_deleteLine?".loc();
          payload.callback = function (response) {
            if (response.answer) {
              XM.Model.prototype.destroy.apply(that, args);
            }
          };
        } else if (status === K.OPEN_STATUS) {
          message = "_closeLine?".loc();
          payload.callback = function (response) {
            if (response.answer) {
              that.set("status", K.CLOSED_STATUS);
              if (options && options.success) {
                options.success(that, response, options);
              }
            }
          };
        } else {
          // Must be closed, shouldn't have come here.
          return;
        }

        this.notify(message, payload);
      },

      initialize: function (attributes, options) {
        XM.Model.prototype.initialize.apply(this, arguments);
        this.taxDetail = [];
      },

      isMiscellaneousChanged: function () {
        var isMisc = this.get("isMiscellaneous");
        this.setReadOnly("isMiscellaneous", this.get("item") || this.get("expenseCategory"));
        this.setReadOnly(["item", "site"], isMisc);
        this.setReadOnly("expenseCategory", !isMisc);
      },

      itemChanged: function () {
        var item = this.get("item"),
          itemSource = this.get("itemSource"),
          purchaseOrder = this.get("purchaseOrder"),
          orderDate = purchaseOrder ? purchaseOrder.get("orderDate") : false,
          vendor = this.getValue("purchaseOrder.vendor"),
          itemSourceCollection,
          that = this,
          options = {},
          expires,
          success,
          count;

        this.isMiscellaneousChanged();
        this.set("vendorUnit", item ? item.getValue("inventoryUnit.name") : "");
        this.set("unitCost", item ? item.get("standardCost") : 0);

        if (!item) {
          this.unset("itemSource");

        // Look up item source if applicable.
        } else if (purchaseOrder && orderDate && item &&
           (!itemSource || itemSource.get("item").id !== item.id)) {
          this._isCount = this._isCount ? this._isCount + 1 : 1;
          count = this._isCount;

          expires = new Date();
          expires.setDate(orderDate.getDate() + 1);

          options.query = {
            parameters: [
              {attribute: "vendor", value: vendor},
              {attribute: "item", value: item},
              {attribute: "isActive", value: true},
              {attribute: "effective", operator: "<=", value: orderDate},
              {attribute: "expires", operator: ">=", value: expires}
            ]
          };

          options.success = function () {
            if (count === that._isCount && itemSourceCollection.length) {
              that.set("itemSource", itemSourceCollection.at(0));
            }
          };

          itemSourceCollection = new XM.ItemSourceCollection();
          itemSourceCollection.fetch(options);
        }
      },

      itemSourceChanged: function () {
        var itemSource = this.get("itemSource"),
          item = this.get("item"),
          quantity = this.get("quantity"),
          attrs = {
            vendorUnit: "",
            vendorUnitRatio: 1
          },
          prices;

        if (itemSource) {
          attrs = {
            item: itemSource.get("item"),
            vendorItemNumber: itemSource.get("vendorItemNumber"),
            vendorItemDescription: itemSource.get("vendorItemDescription"),
            vendorUnit: itemSource.get("vendorUnit"),
            vendorUnitRatio: itemSource.get("vendorUnitRatio"),
            manufacturerName: itemSource.get("manufacturerName"),
            manufacturerItemNumber: itemSource.get("manufacturerItemNumber"),
            manufacturerItemDescription: itemSource.get("manufacturerItemDescription"),
          };

        // Clear if item, if expense leave vendor data alone
        } else if (item) {
          attrs.vendorItemNumber = "";
          attrs.vendorItemDescription = "";
          attrs.manufacturerName = "";
          attrs.manufacturerItemNumber = "";
          attrs.manufacturerItemDescription = "";
        }

        this.set(attrs);

        if (itemSource) { this.calculatePrice(); }
      },

      purchaseOrderChanged: function () {
        var parent = this.get("purchaseOrder"),
         lineNumber = this.get("lineNumber"),
         currency = parent ? parent.get("currency") : false,
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

        if (currency) {
          this.set("currency", currency);
        }
      },

      statusChanged: function () {
        var purchaseOrder = this.get("purchaseOrder");
        if (this.getStatus() === XM.Model.READY_CLEAN) {
          this.isMiscellaneousChanged();
        } else if (this.isDestroyed()) {
          if (purchaseOrder) { purchaseOrder.calculateTotals(); }
        }
      }

    });

    XM.PurchaseOrderLine = XM.PurchaseOrderLine.extend(XM.PurchaseOrderMixin);

    /**
      @class

      @extends XM.Model
    */
    XM.PurchaseOrderLineComment = XM.Comment.extend({

      recordType: "XM.PurchaseOrderLineComment",

      sourceName: "PI"

    });

    /**
      @class

      @extends XM.Info
    */
    XM.PurchaseOrderListItem = XM.Info.extend({

      recordType: "XM.PurchaseOrderListItem",

      editableModel: "XM.PurchaseOrder"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.PurchaseOrderCharacteristic = XM.Model.extend(/** @lends XM.PurchaseOrderListItemCharacteristic.prototype */{

      recordType: "XM.PurchaseOrderListItemCharacteristic"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.PurchaseOrderListItemCharacteristic = XM.Model.extend({
      /** @scope XM.PurchaseOrderListItemCharacteristic.prototype */

      recordType: "XM.PurchaseOrderListItemCharacteristic"

    });

    XM.PurchaseOrderListItem = XM.PurchaseOrderListItem.extend(XM.PurchaseOrderMixin);

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.PurchaseOrderListItemCollection = XM.Collection.extend({

      model: XM.PurchaseOrderListItem

    });


    /**
      @class

      @extends XM.Collection
    */
    XM.PurchaseTypeCollection = XM.Collection.extend({

      model: XM.PurchaseType

    });


    /**
      @class

      @extends XM.Collection
    */
    XM.PurchaseEmailProfileCollection = XM.Collection.extend({

      model: XM.PurchaseEmailProfile

    });

  };

}());

