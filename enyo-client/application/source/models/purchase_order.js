/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.PurchaseOrder = XM.Document.extend({
    /** @scope XM.PurchaseOrder.prototype */

    recordType: 'XM.PurchaseOrder',

    documentKey: "number"

  });

  /**
    @class

    @extends XM.Model
  */
  XM.PurchaseOrderLine = XM.Model.extend({
    /** @scope XM.PurchaseOrder.prototype */

    recordType: 'XM.PurchaseOrderLine',

    idAttribute: 'uuid',

    name: function () {
      return this.getValue("purchaseOrder.id") + " #" + this.getValue("lineNumber");
    },

    bindEvents: function () {
      XM.Model.prototype.bindEvents.apply(this, arguments);
      // Bind events
      this.on('statusChange', this.statusDidChange);
    },

    save: function (key, value, options) {
      options = options ? _.clone(options) : {};

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isEmpty(key)) {
        options = value ? _.clone(value) : {};
      }

      // Need to get more info about the itemsite first
      var query = {},
        that = this,
        itemSites = new XM.ItemSiteRelationCollection(),
        fetchOptions = {query: query};

      fetchOptions.success = function () {
        var K = XM.ItemSite,
          itemSite = itemSites.at(0),
          issOptions = {},
          params = [
            [{
              uuid: that.id,
              quantity: that.get("toReceive")
            }],
            issOptions
          ],
          locationControl = itemSite.get("locationControl"),
          controlMethod = itemSite.controlMethod,
          // Techically check for LOT / SERIAL should be done in standard ed.
          // but let's just get it working for now.
          requiresDetail = locationControl ||
            controlMethod === K.LOT_CONTROL ||
            controlMethod === K.SERIAL_CONTROL,

          // Callback to handle detail if applicable
          callback = function (detail) {
            var dispOptions = {};

            // Refresh the model we started from passing options through
            dispOptions.success = function () {
              that.fetch(options);
            };
            if (detail) {
              issOptions.detail = detail;
            }
            that.dispatch("XM.Inventory", "enterReceipt", params, dispOptions);

          };
        if (requiresDetail) {
          // Send notification that we need to accumulate detail
          // Execute callback when we get results
        } else {
          callback();
        }

      };

      query.parameters = [
        {
          attribute: "item",
          value: this.getValue("itemSite.item")
        },
        {
          attribute: "site",
          value: this.getValue("itemSite.site")
        }
      ];

      itemSites.fetch(fetchOptions);
      return this;
    },

    statusDidChange: function () {
      if (this.getStatus() === XM.Model.READY_CLEAN) {
        this.set("toReceive", this.get("toReceive"));
      }
    }

  });

  /**
    @class

    @extends XM.Info
  */
  XM.PurchaseOrderRelation = XM.Info.extend({
    /** @scope XM.PurchaseOrderRelation.prototype */

    recordType: 'XM.PurchaseOrderRelation',

    editableModel: 'XM.PurchaseOrder',

    descriptionKey: "number"

  });

  /**
    @class

    @extends XM.Info
  */
  XM.PurchaseOrderListItem = XM.Info.extend({
    /** @scope XM.ContactListItem.prototype */

    recordType: 'XM.PurchaseOrderListItem',

    editableModel: 'XM.PurchaseOrder'

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.PurchaseOrderLineCollection = XM.Collection.extend({
    /** @scope XM.PurchaseOrderLineCollection.prototype */

    model: XM.PurchaseOrderLine

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.PurchaseOrderListItemCollection = XM.Collection.extend({
    /** @scope XM.PurchaseOrderListItemCollection.prototype */

    model: XM.PurchaseOrderListItem

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.PurchaseOrderRelationCollection = XM.Collection.extend({
    /** @scope XM.PurchaseOrderListItemCollection.prototype */

    model: XM.PurchaseOrderRelation

  });

}());
