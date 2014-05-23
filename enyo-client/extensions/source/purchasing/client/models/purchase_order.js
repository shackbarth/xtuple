/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Globalize:true */

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
        Deprecated. Use `formatStatus`.

        @returns {String}
      */
      formatStatus: function () {
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
        "subtotal",
        "taxTotal",
        "total"
      ],

      handlers: {
        "add:lineItems remove:lineItems": "lineItemsChanged",
        "change:currency": "handleLineItems",
        "change:freight": "calculateFreightTax",
        "change:purchaseType": "purchaseTypeChanged",
        "change:site": "siteChanged",
        "change:status": "purchaseOrderStatusChanged",
        "change:taxZone": "recalculateTaxes",
        "change:vendor": "vendorChanged",
        "change:vendorAddress": "vendorAddressChanged",
        "status:READY_CLEAN": "statusReadyClean",
        "status:READY_NEW": "statusReadyNew"
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

      handleLineItems: function () {
        var vendor = this.get("vendor"),
          currency = this.get("currency"),
          site = this.get("site");
        this.setReadOnly("lineItems", !vendor || !currency || !site);
      },

      initialize: function (attributes, options) {
        XM.Document.prototype.initialize.apply(this, arguments);
        if (XT.session.settings.get("RequirePOTax")) {
          this.requiredAttributes.push("taxZone");
        }
        this.taxDetail = [];
        this.freightTaxDetail = [];
      },

      lineItemsChanged: function () {
        if (!this.isReady()) { return; }

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
          lineItems = this.get("lineItems"),
          received = function (lineItem) {
            return lineItem.get("received") + lineItem.get("toReceive");
          },
          K = XM.Model,
          that = this,
          prevStatus,
          transacted,
          message;

        if (status === XM.PurchaseOrder.UNRELEASED_STATUS &&
            _.some(lineItems.models, received)) {
          message = "_transactedPoNotUnreleased".loc();
          prevStatus = this.previous("status");
          this.notify(message, {
            type: K.CRITICAL,
            callback: function () {
              that.set("status", prevStatus);
            }
          });
          return;
        }

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
            shiptoContactMiddleName: "",
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
          attrs.shiptoContactMiddleName = contact.get("middleName");
          attrs.shiptoContactSuffix = contact.get("suffix");
          attrs.shiptoContactTitle = contact.get("title");
          attrs.shiptoContactPhone = contact.get("phone");
          attrs.shiptoContactFax = contact.get("fax");
          attrs.shiptoContactEmail = contact.get("primaryEmail");
        }

        this.set(attrs);
        this.handleLineItems();
      },

      statusReadyClean: function () {
        var status = this.get("status"); // Purchase order status
        if (status === XM.PurchaseOrder.CLOSED_STATUS) {
          this.setReadOnly(true);
        } else {
          this.setReadOnly("lineItems", false);
          this.setReadOnly(["number", "orderDate", "site", "vendor"]);
        }
      },

      statusReadyNew: function () {
        this.siteChanged();
      },

      validate: function () {
        var err = XM.Document.prototype.validate.apply(this, arguments),
          lineItems = this.get("lineItems"),
          status = this.get("status"),
          K = XM.PurchaseOrder,
          validItems;

        // Check that we have line items
        if (!err && this.previousStatus() !== XM.Model.DESTROYED_DIRTY) {
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
        this.handleLineItems();
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
            vendorContactMiddleName: "",
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
          attrs.vendorContactMiddleName = contact.get("middleName");
          attrs.vendorContactSuffix = contact.get("suffix");
          attrs.vendorContactTitle = contact.get("title");
          attrs.vendorContactPhone = contact.get("phone");
          attrs.vendorContactFax = contact.get("fax");
          attrs.vendorContactEmail = contact.get("primaryEmail");
        }

        this.set(attrs);
      }

    });

    XM.PurchaseOrder = XM.PurchaseOrder.extend(XM.PurchaseOrderMixin);
    XM.PurchaseOrder = XM.PurchaseOrder.extend(XM.WorkflowMixin);
    XM.PurchaseOrder = XM.PurchaseOrder.extend(XM.EmailSendMixin);
    XM.PurchaseOrder = XM.PurchaseOrder.extend({
      emailDocumentName: "_purchaseOrder".loc(),
      emailProfileAttribute: "purchaseType.emailProfile",
      emailStatusMethod: "formatStatus"
    });

    // ..........................................................
    // CONSTANTS
    //
    _.extend(XM.PurchaseOrder, /** @lends XM.PurchaseOrder# */{

      used: function (id, options) {
        return XM.ModelMixin.dispatch('XM.PurchaseOrder', 'used', [id], options);
      },

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

      TYPE_POST_RECEIPTS: "T",

      TYPE_RECEIVE: "R",

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
          unitCost: 0,
          status: XM.PurchaseOrder.UNRELEASED_STATUS,
          vouchered: 0
        };
      },

      readOnlyAttributes: [
        "expenseCategory",
        "extendedPrice",
        "lineNumber",
        "received",
        "returned",
        "status",
        "tax",
        "toReceive",
        "unitCost",
        "vendorUnit",
        "vendorUnitRatio",
        "vouchered"
      ],

      handlers: {
        "change:dueDate": "dueDateChanged",
        "change:expenseCategory": "isMiscellaneousChanged",
        "change:extendedPrice change:freight change:taxType": "calculateTax",
        "change:item": "itemChanged",
        "change:itemSource": "itemSourceChanged",
        "change:isMiscellaneous": "isMiscellaneousChanged",
        "change:price": "priceChanged",
        "change:purchaseOrder": "purchaseOrderChanged",
        "change:site": "calculatePrice",
        "change:quantity": "quantityChanged",
        "status:READY_CLEAN": "statusReadyClean",
        "status:DESTROYED_DIRTY": "statusDestroyedDirty"
      },

      taxDetail: null,

      calculateExtendedPrice: function () {
        var quantity = this.get("quantity") || 0,
          price = this.get("price") || 0,
          purchaseOrder = this.get("purchaseOrder"),
          oldExtendedPrice = this.get("extendedPrice"),
          extendedPrice = quantity * price;

        // Don't let no-change trigger events get tangled
        if (extendedPrice !== oldExtendedPrice) {
          this.set("extendedPrice", quantity * price);
          if (purchaseOrder) { purchaseOrder.calculateTotals(); }
        }
      },

      calculatePrice: function () {
        var itemSource = this.get("itemSource"),
          item = this.get("item"),
          site = this.get("site"),
          quantity = this.get("quantity") || 0,
          oldPrice = this.get("price"),
          price = oldPrice || 0;

        if (itemSource) {
          price = itemSource.calculatePrice(quantity, site);
        }

        // Don't let no-change trigger events get tangled
        if (price !== oldPrice) {
          this.set("price", price);
        }
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

      dueDateChanged: function (model, resp, options) {
        options = options || {};
        var itemSource = this.get("itemSource"),
          dueDate = this.get("dueDate"),
          that = this,
          K = XM.Model,
          earliestDate,
          success = options.success;

        if (itemSource && dueDate) {
          earliestDate = itemSource.get("earliestDate");
          if (XT.date.compareDate(dueDate, earliestDate) < 0) {
            this.notify("_correctToEarliestDate?".loc(), {
              type: K.QUESTION,
              callback: function (response) {
                if (response.answer) {
                  that.set("dueDate", earliestDate);
                }
                if (success) { success(this, resp, options); }
              }
            });
            return;
          }
        }
        if (success) { success(this, resp, options); }
      },

      destroy: function (options) {
        var status = this.getParent().get("status"),
          K = XM.PurchaseOrder,
          that = this,
          payload = {
            type: K.QUESTION,
          },
          args = arguments,
          message,
          callback;

        if (status === K.UNRELEASED_STATUS) {
          callback = function (response) {
            if (response.answer) {
              XM.Model.prototype.destroy.apply(that, args);
            }
          };
          if (options.validate === false) {
            callback({answer: true});
            return;
          }
          message = "_deleteLine?".loc();
        } else if (status === K.OPEN_STATUS) {
          callback = function (response) {
            if (response.answer) {
              that.set("status", K.CLOSED_STATUS);
              if (options && options.success) {
                options.success(that, response, options);
              }
            }
          };
          if (options.validate === false) {
            callback({answer: true});
            return;
          }
          message = "_closeLine?".loc();
        } else {
          // Must be closed, shouldn't have come here.
          return;
        }

        payload.callback = callback;
        this.notify(message, payload);
      },

      initialize: function (attributes, options) {
        XM.Model.prototype.initialize.apply(this, arguments);
        if (XT.session.settings.get("RequireProjectAssignment")) {
          this.requiredAttributes.push("project");
        }
        this.taxDetail = [];
      },

      isActive: function () {
        return this.get("status") !== XM.PurchaseOrder.CLOSED_STATUS;
      },

      isMiscellaneousChanged: function () {
        var isMisc = this.get("isMiscellaneous");
        if (isMisc) {
          this.unset("item");
          this.unset("site");
        } else {
          this.unset("expenseCategory");
        }
        this.setReadOnly("isMiscellaneous", !_.isNull(this.get("item"))  ||
                                            !_.isNull(this.get("expenseCategory")));
        this.setReadOnly(["item", "site"], isMisc);
        this.setReadOnly("expenseCategory", !isMisc);
      },

      itemChanged: function () {
        var item = this.get("item"),
          itemSource = this.get("itemSource"),
          purchaseOrder = this.get("purchaseOrder"),
          taxZone = purchaseOrder ? purchaseOrder.get("taxZone") : null,
          orderDate = purchaseOrder ? purchaseOrder.get("orderDate") : false,
          vendor = this.getValue("purchaseOrder.vendor"),
          characteristics = this.get("characteristics"),
          K = XM.Model,
          itemSourceCollection,
          that = this,
          options = {},
          taxOptions = {},
          standardCost,
          itemCharAttrs,
          charTypes,
          expires,
          success,
          message,
          count,
          len,
          i;

        if (item && XT.session.settings.get("RequireStdCostForPOItem")) {
          standardCost = item.get("standardCost") || 0;
          if (!standardCost) {
            message = "_errorStandardCostRequired".loc();
            message = message.replace("{number}", item.get("number"));
            this.notify(message, {
              type: K.CRITICAL,
              callback: function () {
                that.unset("item");
              }
            });
            return;
          }
        }

        this.isMiscellaneousChanged();
        this.unset("taxType");
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
              that.off("change:price", that.priceChanged);
              that.set("itemSource", itemSourceCollection.at(0));
              that.calculateExtendedPrice();
              that.on("change:price", that.priceChanged);
            }
          };

          itemSourceCollection = new XM.ItemSourceCollection();
          itemSourceCollection.fetch(options);
        }

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

        // Destroy old characteristics
        len = characteristics.length;
        for (i = 0; i < len; i++) {
          characteristics.at(0).destroy();
        }

        // Set sort for characteristics
        if (!characteristics.comparator) {
          characteristics.comparator = function (a, b) {
            var aOrd = a.getValue("characteristic.order"),
              aName = a.getValue("characteristic.name"),
              bOrd = b.getValue("characteristic.order"),
              bName = b.getValue("characteristic.name");
            if (aOrd === bOrd) {
              return aName === bName ? 0 : (aName > bName ? 1 : -1);
            } else {
              return aOrd > bOrd ? 1 : -1;
            }
          };
        }

        // Build characteristics
        itemCharAttrs = _.pluck(item.get("characteristics").models, "attributes");
        charTypes = _.unique(_.pluck(itemCharAttrs, "characteristic"));
        _.each(charTypes, function (char) {
          var lineChar = new XM.PurchaseOrderLineCharacteristic(null, {isNew: true}),
            defaultChar = _.find(itemCharAttrs, function (attrs) {
              return attrs.isDefault === true &&
                attrs.characteristic.id === char.id;
            });
          lineChar.set("characteristic", char);
          lineChar.set("value", defaultChar ? defaultChar.value : "");
          characteristics.add(lineChar);
        });
      },

      itemSourceChanged: function () {
        var itemSource = this.get("itemSource"),
          item = this.get("item"),
          quantity = this.get("quantity"),
          that = this,
          attrs = {
            vendorUnit: "",
            vendorUnitRatio: 1
          },
          prices,
          callback;

        if (itemSource) {
          attrs = {
            isMiscellaneous: false,
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

        if (itemSource) {
          callback = function () {
            that.quantityChanged();  // Force quantity validation and repricing.
          };
          // Need a callback in case multiple async questions are asked
          this.dueDateChanged(this, null, {success: callback});
        }
      },

      priceChanged: function () {
        var price = this.get("price"),
          item = this.get("item"),
          K = XM.Model,
          that = this,
          vendorUnitRatio,
          curCost,
          maxCost,
          message;

        this.calculateExtendedPrice();

        if (item && _.isNumber(price)) {
          // TODO: This really should consider currency conversion as well
          vendorUnitRatio = this.get("vendorUnitRatio") || 1;
          curCost = price / vendorUnitRatio;
          maxCost = item.get("maximumDesiredCost");
          if (maxCost < curCost) {
            message = "_warnMaxCostExceeded".loc();
            maxCost = Globalize.format(maxCost, "c" + XT.COST_SCALE);
            message = message.replace("{maximumDesiredCost}", maxCost);
            this.notify(message, {type: K.WARNING});
          }
        }
      },

      purchaseOrderChanged: function () {
        var purchaseOrder = this.get("purchaseOrder"),
         lineNumber = this.get("lineNumber"),
         currency = purchaseOrder ? purchaseOrder.get("currency") : false,
         status = purchaseOrder ? purchaseOrder.get("status") : false,
         site = this.get("site"),
         lineNumberArray,
         maxLineNumber;

        if (!this.isReady()) { return; } // Can't silence backbone relation events

        // Set next line number to be 1 more than the highest living model
        if (purchaseOrder && !lineNumber) {
          lineNumberArray = _.compact(_.map(purchaseOrder.get("lineItems").models, function (model) {
            return model.isDestroyed() ? null : model.get("lineNumber");
          }));
          maxLineNumber = lineNumberArray.length > 0 ? Math.max.apply(null, lineNumberArray) : 0;
          this.set("lineNumber", maxLineNumber + 1);
        }

        if (status) {
          this.set("status", status);
        }

        if (currency) {
          this.set("currency", currency);
        }

        if (!site) {
          this.set("site", purchaseOrder.get("site"));
        }

      },

      quantityChanged: function () {
        var itemSource = this.get("itemSource"),
          quantity = this.get("quantity"),
          that = this,
          K = XM.Model,
          minimumOrderQuantity,
          multipleOrderQuantity,
          quotient;

        if (itemSource && quantity) {
          minimumOrderQuantity = itemSource.get("minimumOrderQuantity");
          if (quantity < minimumOrderQuantity) {
            this.notify("_correctToMinimumQuantity?".loc(), {
              type: K.QUESTION,
              callback: function (response) {
                if (response.answer) {
                  that.set("quantity", minimumOrderQuantity);
                }
              }
            });
          } else {
            multipleOrderQuantity = itemSource.get("multipleOrderQuantity");
            quotient = quantity / multipleOrderQuantity;
            if (quotient !== Math.round(quotient)) {
              this.notify("_correctToMultipleQuantity?".loc(), {
                type: K.QUESTION,
                callback: function (response) {
                  if (response.answer) {
                    quantity = Math.ceil(quotient) * multipleOrderQuantity;
                    that.set("quantity", quantity);
                  }
                }
              });
            }
          }
        }

        this.calculatePrice();
      },

      statusReadyClean: function () {
        this.setReadOnly(["isMiscellaneous", "item", "expenseCategory"]);
      },

      statusDestroyedDirty: function () {
        if (!this.get("purchaseOrder").isDestroyed()) {
          this.get("purchaseOrder").calculateTotals();
        }
      },

      validate: function () {
        var err = XM.Document.prototype.validate.apply(this, arguments),
          isMisc = this.get("isMiscellaneous"),
          params = {};

        // Check that we've ordered something legit
        if (isMisc && !this.get("expenseCategory")) {
          params.attr = "_expenseCategory".loc();
          return XT.Error.clone("xt1004", { params: params });
        } else if (!isMisc) {
          if (!this.get("item")) {
            params.attr = "_item".loc();
            return XT.Error.clone("xt1004", { params: params });
          } else if (!this.get("site")) {
            params.attr = "_site".loc();
            return XT.Error.clone("xt1004", { params: params });
          }
        }

        return err;
      }

    });

    XM.PurchaseOrderLine = XM.PurchaseOrderLine.extend(XM.PurchaseOrderMixin);

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.PurchaseOrderLineCharacteristic = XM.CharacteristicAssignment.extend(
      /** @lends XM.PurchaseOrderLineCharacteristic.prototype */{

      recordType: "XM.PurchaseOrderLineCharacteristic",

      canView: function () {
        return true;
      }

    });

    /**
      @class

      @extends XM.Comment
    */
    XM.PurchaseOrderLineComment = XM.Comment.extend({

      recordType: "XM.PurchaseOrderLineComment",

      sourceName: "PI"

    });

    /** @private */
    var _doDispatch = function (method, callback, params) {
      var that = this,
        options = {};
      params = params || [];
      params.unshift(this.id);
      options.success = function (resp) {
        var fetchOpts = {};
        fetchOpts.success = function () {
          if (callback) { callback(resp); }
        };
        if (resp) {
          that.fetch(fetchOpts);
        }
      };
      options.error = function (resp) {
        if (callback) { callback(resp); }
      };
      this.dispatch("XM.PurchaseOrder", method, params, options);
      return this;
    };

    /**
      @class

      @extends XM.Info
    */
    XM.PurchaseOrderListItem = XM.Info.extend({

      recordType: "XM.PurchaseOrderListItem",

      editableModel: "XM.PurchaseOrder",

      canRelease: function (callback) {
        var status = this.get("status");

        if (callback) {
          callback(status === XM.PurchaseOrder.UNRELEASED_STATUS);
        }

        return this;
      },

      canUnrelease: function (callback) {
        var status = this.get("status"),
          ret = status === XM.PurchaseOrder.OPEN_STATUS,
          options = {},
          params;

        if (ret) {
          params = [this.id, true];
          options.success = function (resp) {
            if (callback) { callback(!resp); }
          };
          this.dispatch("XM.PurchaseOrder", "used", params, options);
        } else {
          if (callback) {
            callback(ret);
          }
          return ret;
        }
      },

      doRelease: function (callback) {
        return _doDispatch.call(this, "release", callback);
      },

      doUnrelease: function (callback) {
        return _doDispatch.call(this, "unrelease", callback);
      }

    });

    /**
      @class

      @extends XM.Model
    */
    XM.PurchaseOrderCharacteristic = XM.Model.extend(
      /** @lends XM.PurchaseOrderCharacteristic.prototype */{

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
