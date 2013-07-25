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

      @extends XM.Info
    */
    XM.PurchaseOrderRelation = XM.Info.extend({
      /** @scope XM.ContactRelation.prototype */

      recordType: 'XM.PurchaseOrderRelation',

      editableModel: 'XM.PurchaseOrder',

      numberKey: "number"

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
    // METHODS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.PurchaesOrderCollection = XM.Collection.extend(/** @lends XM.PurchaseOrderCollection.prototype */{

      model: XM.PurchaseOrder

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
