/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.purchasing.initItemSiteModels = function () {

    var _proto = XM.ItemSite.prototype,
      _defaults = _proto.defaults;

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
      ]
    });

  };


}());

