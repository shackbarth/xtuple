/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore"),
    common = require("../lib/common"),
    salesOrderUtils = require("./sales_order"),
    assert = require("chai").assert;


  /**
    Purchase Order Description
    @class
    @alias PurchaseOrder
  */
  var spec = {
    recordType: "XM.PurchaseOrder",
    collectionType: "XM.PurchaseOrderListItemCollection",
    cacheName: null,
    listKind: "XV.PurchaseOrderList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof PurchaseOrder
      @description Purchase orders are lockable.
    */
    isLockable: true,
    /**
      @member -
      @memberof PurchaseOrder
      @description The ID attribute is "number", which will be automatically uppercased.
    */
    idAttribute: "number",
    enforceUpperKey: true,
    attributes: ["number", "characteristics"],
    /**
      @member -
      @memberof PurchaseOrder
      @description Used in the purchasing module
    */
    extensions: ["purchasing"],
    /**
      @member -
      @memberof PurchaseOrder
      @description Sales Orders can be read by people with "ViewPurchaseOrder"
       and can be created, updated,
       or deleted by users with the "MaintainPurchaseOrder" privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainPurchaseOrders",
      read: "ViewPurchaseOrders"
    },
    createHash: {
      vendor: { number: "VOFFP" }
    },
    //
    // An extra bit of work we have to do after the createHash fields are set:
    // create a valid line item.
    //
    beforeSaveActions: [{it: 'sets up a valid line item',
      action: salesOrderUtils.getBeforeSaveAction("XM.PurchaseOrderLine")}],
    beforeSaveUIActions: [{it: 'sets up a valid line item',
      action: function (workspace, done) {
        var gridRow;

        salesOrderUtils.primeSubmodels(function (submodels) {
          workspace.$.purchaseOrderLineItemBox.newItem();
          gridRow = workspace.$.purchaseOrderLineItemBox.$.editableGridRow;
          gridRow.$.itemSiteWidget.doValueChange({value: {item: submodels.itemModel,
            site: submodels.siteModel}});
          gridRow.$.quantityWidget.doValueChange({value: 5});
          gridRow.$.dateWidget.doValueChange({value: new Date()});
          setTimeout(function () {
            done();
          }, 3000);
        });
      }
    }],
    updateHash: {
      notes: "foo"
    }
  };
  exports.spec = spec;

}());

