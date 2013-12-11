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

      recordType: "XM.PurchaseType"

    });

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.PurchaseTypeCharacteristic = XM.CharacteristicAssignment.extend(/** @lends XM.PurchaseTypeCharacteristic.prototype */{

      recordType: 'XM.PurchaseTypeCharacteristic',

      which: 'isPurchaseOrders'

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

      recordType: 'XM.PurchaseEmailProfile'

    });

    XM.PurchaseOrderMixin = {
      /**
        Returns Purchase order status as a localized string.

        @returns {String}
      */
      getPurchaseOrderStatusString: function () {
        var K = XM.PurchaseOrder,
          status = this.get('status');

        switch (status)
        {
        case K.UNRELEASED_STATUS:
          return '_unreleased'.loc();
        case K.OPEN_STATUS:
          return '_open'.loc();
        case K.CLOSED_STATUS:
          return '_closed'.loc();
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

      numberPolicySetting: 'PONumberGeneration',

      defaults: function () {
        var agent = XM.agents.find(function (agent) {
            return agent.id === XM.currentUser.id;
          });
        return {
          orderDate: XT.date.today(),
          status: XM.PurchaseOrder.UNRELEASED_STATUS,
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
        "add:lineItems": "lineItemsChanged",
        "add:lineItems remove:lineItems": "calculateTotals",
        "remove:lineItems": "lineItemsChanged",
        "change:status": "purchaseOrderStatusChanged",
        "change:purchaseType": "purchaseTypeChanged",
        "change:vendor": "vendorChanged"
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
          var extPrice = lineItem.get('extendedPrice') || 0,
            quantity = lineItem.get("quantity") || 0,
            freight = lineItem.get("freight") || 0,
            item = lineItem.get("item"),
            quantityUnitRatio = lineItem.get("quantityUnitRatio");

          subtotals.push(extPrice);
          freightSubtotals.push(freight);
          taxDetails = taxDetails.concat(lineItem.taxDetail);
        };

        _.each(this.get('lineItems').models, forEachCalcFunction);

        // Add freight taxes to the mix
        taxDetails = taxDetails.concat(this.freightTaxDetail);

        // Total taxes
        // First group amounts by tax code
        /*
        taxCodes = _.groupBy(taxDetails, function (detail) {
          return detail.taxCode.id;
        });
        */

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
      },

      vendorChanged: function () {
        var vendor = this.get("vendor"),
          address = vendor ? vendor.get("address") : false,
          contact = vendor ? vendor.get("contact") : false,
          attrs = {}; // TODO: Defaults

        if (vendor) {
          //attrs.destinationName = site.get("code");

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
            attrs.vendorContact = contact.id;
            attrs.vendorContactName = contact.get("name");
            attrs.vendorPhone = contact.get("phone");
          }
        }

        this.set(attrs);
        this.setReadOnly("lineItems", !vendor);
      },

      lineItemsChanged: function () {
        var hasLineItems = this.get("lineItems").length > 0;
        this.setReadOnly(["vendor", "currency"], hasLineItems);
        this.setReadOnly("status", !hasLineItems);
        if (!hasLineItems) {
          this.set("status", XM.PurchaseOrder.UNRELEASED_STATUS);
        }
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

      statusDidChange: function () {
        XM.Document.prototype.statusDidChange.apply(this, arguments);
        var status = this.getStatus(),
          K = XM.Model,
          lineCount;
        if (status === K.READY_NEW) {
          // TO DO
        } else if (status === K.READY_CLEAN) {
          this.setReadOnly("lineItems", false);
          this.lineItemsChanged();
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
            return XT.Error.clone('xt2012');
          }
        }

        // Check for valid po status
        if (status === K.UNRELEASED_STATUS) {
          lineItems.each(function (item) {
            if (item.get("toReceive") ||
                item.get("received") ||
                item.get("vouchered")) {
              err = XT.Error.clone('xt2025');
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

      recordType: 'XM.PurchaseOrderCharacteristic',

      which: 'isPurchaseOrders'

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

      recordType: 'XM.PurchaseOrderWorkflow'

    });

    _.extend(XM.PurchaseOrderWorkflow, /** @lends XM.PurchaseOrderWorkflow# */{

      TYPE_OTHER: "O",

      TYPE_RECEIVE: "R",

      TYPE_POST_RECEIPTS: "P"

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
        "change:item": "itemChanged",
        "change:isMiscellaneous": "isMiscellaneousChanged",
        "change:purchaseOrder": "purchaseOrderChanged"
      },

      taxDetail: null,

      initialize: function (attributes, options) {
        XM.Model.prototype.initialize.apply(this, arguments);
        this.taxDetail = [];
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

      isMiscellaneousChanged: function () {
        var isMisc = this.get("isMiscellaneous");
        this.setReadOnly("isMiscellaneous", this.get("item") || this.get("expenseCategory"));
        this.setReadOnly(["item", "site"], isMisc);
        this.setReadOnly("expenseCategory", !isMisc);
      },

      itemChanged: function () {
        var item = this.get("item");
        this.isMiscellaneousChanged();
        this.set("vendorUnit", item ? item.getValue("inventoryUnit.name") : "");
        this.set("unitCost", item ? item.getValue("standardCost") : 0);
      },

      purchaseOrderChanged: function () {
        var parent = this.getParent(),
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
        if (this.getStatus() === XM.Model.READY_CLEAN) {
          this.isMiscellaneousChanged();
        } else if (this.isDestroyed()) {
          this.get("purchaseOrder").calculateTotals();
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

      recordType: 'XM.PurchaseOrderListItemCharacteristic'

    });

    /**
      @class

      @extends XM.Model
    */
    XM.PurchaseOrderListItemCharacteristic = XM.Model.extend({
      /** @scope XM.PurchaseOrderListItemCharacteristic.prototype */

      recordType: 'XM.PurchaseOrderListItemCharacteristic'

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

