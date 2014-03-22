/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  XT.extensions.purchasing.initStaticModels = function () {
    var K = XM.ItemSourcePrice,
     i;

    // Item Source Price Types
    var itemSourcePriceTypesJson = [
      { id: K.TYPE_NOMINAL, name: "_nominal".loc() },
      { id: K.TYPE_DISCOUNT, name: "_discount".loc() }
    ];
    XM.ItemSourcePriceTypeModel = Backbone.Model.extend({
    });
    XM.ItemSourcePriceTypeCollection = Backbone.Collection.extend({
      model: XM.ItemSourcePriceTypeModel
    });
    XM.itemSourcePriceTypes = new XM.ItemSourcePriceTypeCollection();
    for (i = 0; i < itemSourcePriceTypesJson.length; i++) {
      var itemSourcePriceType = new XM.ItemSourcePriceTypeModel(itemSourcePriceTypesJson[i]);
      XM.itemSourcePriceTypes.add(itemSourcePriceType);
    }

    // Purchase Order
    K = XM.PurchaseOrder;
    var purchaseOrderStatusesJson = [
      { id: K.UNRELEASED_STATUS, name: "_unreleased".loc() },
      { id: K.OPEN_STATUS, name: "_open".loc() },
      { id: K.CLOSED_STATUS, name: "_closed".loc() }
    ];
    XM.PurchaseOrderStatusModel = Backbone.Model.extend({
    });
    XM.PurchaseOrderStatusCollection = Backbone.Collection.extend({
      model: XM.PurchaseOrderStatusModel
    });
    XM.purchaseOrderStatuses = new XM.PurchaseOrderStatusCollection();
    for (i = 0; i < purchaseOrderStatusesJson.length; i++) {
      var purchaseOrderStatus = new XM.PurchaseOrderStatusModel(purchaseOrderStatusesJson[i]);
      XM.purchaseOrderStatuses.add(purchaseOrderStatus);
    }

    // Purchase Order Workflow
    K = XM.PurchaseOrderWorkflow;
    var purchaseOrderWorkflowTypeJson = [
      { id: K.TYPE_OTHER, name: "_other".loc() }
    ];
    XM.PurchaseOrderWorkflowTypeModel = Backbone.Model.extend({});
    XM.PurchaseOrderWorkflowTypeCollection = Backbone.Collection.extend({
      model: XM.PurchaseOrderWorkflowTypeModel
    });
    XM.purchaseOrderWorkflowTypes = new XM.PurchaseOrderWorkflowTypeCollection();
    _.each(purchaseOrderWorkflowTypeJson, function (obj) {
      XM.purchaseOrderWorkflowTypes.add(new XM.PurchaseOrderWorkflowTypeModel(obj));
    });

  };

}());
