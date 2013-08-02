/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initSalesOrderModels = function () {

    /**
      @class

      @extends XM.Model
    */
    XM.SalesOrderLineListItem = XM.Model.extend({

      recordType: 'XM.SalesOrderLineListItem'

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ShippableSalesOrderLine = XM.Model.extend({

      recordType: 'XM.ShippableSalesOrderLine',

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

      save: function () {
        // Do something else
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
    XM.SalesOrderLineListItemCollection = XM.Collection.extend({

      model: XM.SalesOrderLineListItem

    });

      /**
      @class

      @extends XM.Collection
    */
    XM.ShippableSalesOrderLineCollection = XM.Collection.extend({

      model: XM.ShippableSalesOrderLine

    });

  };

}());
