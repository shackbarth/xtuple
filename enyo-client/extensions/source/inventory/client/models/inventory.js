/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initInventoryModels = function () {

    /**
      @class

      @extends XM.Model
    */
    XM.InventoryHistory = XM.Model.extend({
      
      recordType: "XM.InventoryHistory"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.InventoryDetail = XM.Model.extend({
      
      recordType: "XM.InventoryDetail"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.IssueToShipping = XM.Model.extend({

      recordType: 'XM.IssueToShipping',

      readOnlyAttributes: [
        "balance",
        "item",
        "order",
        "ordered",
        "returned",
        "site",
        "shipment",
        "shipped"
      ],

      bindEvents: function () {
        XM.Model.prototype.bindEvents.apply(this, arguments);

        // Bind events
        this.on('statusChange', this.statusDidChange);
      },

      canIssueStock: function (callback) {
        if (callback) {
          callback(true);
        }
        return this;
      },

      canReturnStock: function (callback) {
        if (callback) {
          callback(false);
        }
        return this;
      },

      doIssueStock: function (callback) {
        if (callback) {
          callback(true);
        }
        return this;
      },

      doReturnStock: function (callback) {
        if (callback) {
          callback(true);
        }
        return this;
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
            dispOptions = {},
            params = [
              that.id,
              that.get("toIssue"),
              dispOptions
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
              if (detail) {
                dispOptions.detail = detail;
              }
              that.dispatch("XM.Inventory", "issueToShipping", params, options);
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
            value: this.get("item")
          },
          {
            attribute: "site",
            value: this.get("site")
          }
        ];

        itemSites.fetch(fetchOptions);
        return this;
      },

      statusDidChange: function () {
        if (this.getStatus() === XM.Model.READY_CLEAN) {
          this.set("toIssue", this.get("balance"));
        }
      }


    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.InventoryHistoryCollection = XM.Collection.extend({

      model: XM.InventoryHistory
      
    });

    /**
      @class

      @extends XM.Collection
    */
    XM.IssueToShippingCollection = XM.Collection.extend({

      model: XM.IssueToShipping

    });

  };

}());

