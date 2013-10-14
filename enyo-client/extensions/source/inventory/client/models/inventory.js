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

      issueMethod: "issueItem",

      readOnlyAttributes: [
        "atShipping",
        "balance",
        "item",
        "order",
        "ordered",
        "returned",
        "site",
        "shipment",
        "shipped",
        "unit"
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

      canIssueItem: function (callback) {
        var isShipped = this.getValue("shipment.isShipped") || false,
          hasPrivilege = XT.session.privileges.get("IssueStockToShipping");
        if (callback) {
          callback(!isShipped && hasPrivilege);
        }
        return this;
      },

      canReturnItem: function (callback) {
        var isShipped = this.getValue("shipment.isShipped") || false,
          hasPrivilege = XT.session.privileges.get("ReturnStockFromShipping"),
          atShipping = this.get("atShipping");
        if (callback) {
          callback(!isShipped && atShipping > 0 && hasPrivilege);
        }
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
        Unlike most validations on models, this one accepts a callback
        into which will be forwarded a boolean response. Errors will
        trigger `invalid`.

        @param {Function} Callback
        @returns {Object} Receiver
        */
      validate: function (callback) {
        var toIssue = this.get("toIssue"),
          err;

        // Validate
        if (this.undistributed()) {
          err = XT.Error.clone("xt2017");
        } else if (toIssue <= 0) {
          err = XT.Error.clone("xt2013");
        } else if (toIssue > this.issueBalance()) {
          this.notify("_issueExcess".loc(), {
            type: XM.Model.QUESTION,
            callback: function (resp) {
              callback(resp.answer);
            }
          });
          return this;
        }

        if (err) {
          this.trigger("invalid", this, err, {});
          callback(false);
        } else {
          callback(true);
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
    XM.Inventory.issueItem = function (params, options) {
      var obj = XM.Model.prototype;
      obj.dispatch("XM.Inventory", "issueToShipping", params, options);
    };

    /**
      Static function to call return from shipping on a set of multiple items.

      @params {Array} Array of model ids
      @params {Object} Options
    */
    XM.Inventory.returnItem = function (params, options) {
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

