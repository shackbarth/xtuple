/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.purchasing.initItemSiteModels = function () {

    var _proto = XM.ItemSite.prototype,
      _defaults = _proto.defaults;

    // Unfortunately can't augment this
    _proto.defaults = function () {
      var defaults = _defaults.apply(this, arguments);

      defaults = _.extend(defaults, {
        isPurchased: false,
        isCreatePurchaseOrdersForSalesOrders: false,
        isCreatePurchaseRequestsForSalesOrders: false
      });

      return defaults;
    };

    _proto.augment({
      readOnlyAttributes: [
        'isCreatePurchaseOrdersForSalesOrders',
        'isCreatePurchaseRequestsForSalesOrders'
      ],

      handlers: {
        "change:isCreatePurchaseOrdersForSalesOrders":
          "isCreatePurchaseOrdersForSalesOrdersChanged",
        "change:isCreatePurchaseRequestsForSalesOrders":
          "isCreatePurchaseRequestsForSalesOrdersChanged",
        "change:isPurchased": "isPurchasedChanged",
        "status:READY_CLEAN": "statusReadyClean"
      },

      isCreatePurchaseOrdersForSalesOrdersChanged: function () {
        var isCreatePo = this.get("isCreatePurchaseOrdersForSalesOrders");

        if (isCreatePo) {
          this.set("isCreatePurchaseRequestsForSalesOrders", false);
        }
      },

      isCreatePurchaseRequestsForSalesOrdersChanged: function () {
        var isCreatePr = this.get("isCreatePurchaseRequestsForSalesOrders");

        if (isCreatePr) {
          this.set("isCreatePurchaseOrdersForSalesOrders", false);
        }
      },

      isPurchasedChanged: function (model, changes, options) {
        options = options ? _.clone(options) : {};
        var isPurchased = this.get("isPurchased"),
          itemType = this.getValue("item.itemType"),
          K = XM.Item;

        if (isPurchased && itemType === K.PURCHASED ||
          itemType === K.OUTSIDE_PROCESS) {
          this.setReadOnly([
            "isCreatePurchaseRequestsForSalesOrders",
            "isCreatePurchaseOrdersForSalesOrders"
          ], false);
        } else {
          if (!options.isLoading) {
            this.set({
              isCreatePurchaseRequestsForSalesOrders: false,
              isCreatePurchaseOrdersForSalesOrders: false
            });
          }
          this.setReadOnly([
            "isCreatePurchaseRequestsForSalesOrders",
            "isCreatePurchaseOrdersForSalesOrders"
          ]);
        }
      },

      statusReadyClean: function () {
        this.isPurchasedChanged(this, null, {isLoading: true});
      }
    });

  };


}());

