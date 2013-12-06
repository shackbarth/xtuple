/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  XT.extensions.purchasing.initStaticModels = function () {

    // Purchase Order
    var K = XM.PurchaseOrder,
     i;

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
      { id: K.TYPE_OTHER, name: "_other".loc() },
      { id: K.TYPE_RECEIVE, name: "_receive".loc() },
      { id: K.TYPE_POST_RECEIPT, name: "_postReceipt".loc() }
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
