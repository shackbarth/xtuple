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
    XM.Vendor = XM.Document.extend({
      /** @scope XM.Vendor.prototype */

      recordType: 'XM.Vendor',

      documentKey: "number"

    });

    /**
      @class

      @extends XM.Info
    */
    XM.VendorRelation = XM.Info.extend({
      /** @scope XM.VendorRelation.prototype */

      recordType: 'XM.VendorRelation'

      //editableModel: 'XM.Vendor',

      //numberKey: "number"

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.VendorRelationCollection = XM.Collection.extend(/** @lends XM.VendorRelationCollection.prototype */{

      model: XM.VendorRelation

    });

  };

}());
