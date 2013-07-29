/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initPurchaseOrderModels = function () {

    /**
      @class

      @extends XM.Document
    */
    XM.PurchaseOrder = XM.Document.extend({
      /** @scope XM.PurchaseOrder.prototype */

      recordType: 'XM.PurchaseOrder',

      documentKey: "number"

    });

    /**
      @class

      @extends XM.Document
    */
    XM.PurchaseOrderLine = XM.Document.extend({
      /** @scope XM.PurchaseOrder.prototype */

      recordType: 'XM.PurchaseOrderLine'

    });

    /**
      @class

      @extends XM.Info
    */
    XM.PurchaseOrderRelation = XM.Info.extend({
      /** @scope XM.PurchaseOrderRelation.prototype */

      recordType: 'XM.PurchaseOrderRelation',

      editableModel: 'XM.PurchaseOrder',

      descriptionKey: "number"

    });

    /**
      @class

      @extends XM.Info
    */
    XM.PurchaseOrderListItem = XM.Info.extend({
      /** @scope XM.ContactListItem.prototype */

      recordType: 'XM.PurchaseOrderListItem',

      editableModel: 'XM.PurchaseOrder'

    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.PurchaseOrderLineCollection = XM.Collection.extend({
      /** @scope XM.PurchaseOrderLineCollection.prototype */

      model: XM.PurchaseOrderLine

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.PurchaseOrderListItemCollection = XM.Collection.extend({
      /** @scope XM.PurchaseOrderListItemCollection.prototype */

      model: XM.PurchaseOrderListItem

    });
  };

}());
