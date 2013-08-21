/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

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

      recordType: "XM.IssueToShipping",

      readOnlyAttributes: [
        "atShipping",
        "balance",
        "item",
        "order",
        "ordered",
        "returned",
        "site",
        "shipment",
        "shipped"
      ],

      name: function () {
        return this.get("order") + " #" + this.get("lineNumber");
      },

      bindEvents: function () {
        XM.Model.prototype.bindEvents.apply(this, arguments);

        // Bind events
        this.on("statusChange", this.statusDidChange);
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

        var that = this,
          callback;
        
        // Callback for after we determine quantity validity
        callback = function (resp) {
          if (!resp.answer) { return; }
            
          var dispOptions = {},
            issOptions = {},
            params = [
              that.id,
              that.get("toIssue"),
              issOptions
            ];

          // Refresh once we've completed the work
          dispOptions.success = function () {
            that.fetch(options);
          };
          /*
          if (detail.length) {
            issOptions.detail = detail;
          }
          */
          that.setStatus(XM.Model.BUSY_COMMITTING);
          that.dispatch("XM.Inventory", "issueToShipping", params, dispOptions);

        };

        // Validate
        if (this.get("toIssue") <= 0) {
          this.trigger("invalid", this, XT.Error.clone("xt2013"), options || {});
        } else if (!this.issueBalance() && this.get("toIssue") > 0) {
          this.notify("_issueExcess".loc(), {
            type: XM.Model.QUESTION,
            callback: callback
          });
        } else {
          callback({answer: true});
        }

        return this;
      },

      issueBalance: function () {
        var balance = this.get("balance"),
          atShipping = this.get("atShipping"),
          toIssue = XT.math.subtract(balance, atShipping, XT.QUANTITY_SCALE);
        return toIssue >= 0 ? toIssue : 0;
      },

      requiresDetail: function () {
        return this.getValue("itemSite.locationControl");
      },

      statusDidChange: function () {
        if (this.getStatus() === XM.Model.READY_CLEAN) {
          this.set("toIssue", this.issueBalance());
        }
      },
      /**
        Return the quantity of items that require detail distribution.
      returns Number
      */
      undistributed: function () {
        var toIssue = this.get("toIssue"),
          scale = XT.QTY_SCALE,
          undist = 0,
          dist;
        // We only care about distribution on controlled items
        if (this.requiresDetail() && toIssue) {
          // Get the distributed values
          dist = _.pluck(_.pluck(this.getValue("itemSite.detail").models, "attributes"), "distributed");
          // Filter on only ones that actually have a value
          if (dist.length) {
            undist = XT.math.add(dist, scale);
          }
          undist = XT.math.subtract(toIssue, undist, scale);
        }
        return undist;
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

