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

      @extends XM.Transaction
    */
    XM.IssueToShipping = XM.Transaction.extend({

      recordType: "XM.IssueToShipping",

      quantityAttribute: "toIssue",

      issueMethod: "issueToShipping",

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

      transactionDate: null,

      name: function () {
        return this.get("order") + " #" + this.get("lineNumber");
      },

      bindEvents: function () {
        XM.Model.prototype.bindEvents.apply(this, arguments);

        // Bind events
        this.on("statusChange", this.statusDidChange);
        this.on("change:toIssue", this.toIssueDidChange);
      },

      canIssueStock: function (callback) {
        var isShipped = this.getValue("shipment.isShipped") || false,
          hasPrivilege = XT.session.privileges.get("IssueStockToShipping");
        if (callback) {
          callback(!isShipped && hasPrivilege);
        }
        return this;
      },

      canReturnStock: function (callback) {
        var isShipped = this.getValue("shipment.isShipped") || false,
          hasPrivilege = XT.session.privileges.get("IssueStockToShipping"),
          atShipping = this.get("atShipping");
        if (callback) {
          callback(!isShipped && atShipping > 0 && hasPrivilege);
        }
        return this;
      },

      doReturnStock: function (callback) {
        var that = this,
          options = {};

        // Refresh once we've completed the work
        options.success = function () {
          that.fetch({
            success: function () {
              if (callback) {
                callback();
              }
            }
          });
        };

        this.setStatus(XM.Model.BUSY_COMMITTING);
        this.dispatch("XM.Inventory", "returnFromShipping", [this.id], options);

        return this;
      },

      /**
        Calculate the balance remaining to issue.

        @returns {Number}
      */
      issueBalance: function () {
        var balance = this.get("balance"),
          atShipping = this.get("atShipping"),
          toIssue = XT.math.subtract(balance, atShipping, XT.QUANTITY_SCALE);
        return toIssue >= 0 ? toIssue : 0;
      },

      /**
        Overload: Calls `issueToShipping` dispatch function.

        @returns {Object} Receiver
        */
      save: function (key, value, options) {
        options = options ? _.clone(options) : {};

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isEmpty(key)) {
          options = value ? _.clone(value) : {};
        }

        var toIssue = this.get("toIssue"),
          that = this,
          callback,
          err;
        
        // Callback for after we determine quantity validity
        callback = function (resp) {
          if (!resp.answer) { return; }
            
          var dispOptions = {},
            issOptions = {
              asOf: that.transactionDate
            },
            detail = that.formatDetail(),
            params = [
              that.id,
              that.get("toIssue"),
              issOptions
            ];

          // Refresh once we've completed the work
          dispOptions.success = function () {
            that.fetch(options);
          };

          // Add distribution detail if applicable
          if (detail.length) {
            issOptions.detail = detail;
          }
          that.setStatus(XM.Model.BUSY_COMMITTING);
          that.dispatch("XM.Inventory", this.issueMethod, params, dispOptions);
        };

        // Validate
        if (this.undistributed()) {
          err = XT.Error.clone("xt2017");
        } else if (toIssue <= 0) {
          err = XT.Error.clone("xt2013");
        } else if (!this.issueBalance() && toIssue > 0) {
          this.notify("_issueExcess".loc(), {
            type: XM.Model.QUESTION,
            callback: callback
          });
        }

        if (err) {
          this.trigger("invalid", this, err, options || {});
        } else {
          callback({answer: true});
        }

        return this;
      },

      statusDidChange: function () {
        if (this.getStatus() === XM.Model.READY_CLEAN) {
          this.set("toIssue", this.issueBalance());
        }
      },

      toIssueDidChange: function () {
        this.distributeToDefault();
      }

    });

    /**
      Static function to call issue to shipping on a set of multiple items.

      @params {Array} Data
      @params {Object} Options
    */
    XM.Inventory.issueToShipping = function (params, options) {
      var obj = XM.Model.prototype;
      obj.dispatch("XM.Inventory", "issueToShipping", params, options);
    };

    /**
      Static function to call return from shipping on a set of multiple items.

      @params {Array} Array of model ids
      @params {Object} Options
    */
    XM.Inventory.returnFromShipping = function (params, options) {
      var obj = XM.Model.prototype;
      obj.dispatch("XM.Inventory", "returnFromShipping", params, options);
    };

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

