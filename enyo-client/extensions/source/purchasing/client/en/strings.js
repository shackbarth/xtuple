/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  var lang = XT.stringsFor("en_US", {
    "_freightSubtotal": "Freight Subtotal",
    "_itemSource": "Item Source",
    "_itemSources": "Item Sources",
    "_isDropShip": "Drop Ship",
    "_manufacturer": "Manufacturer",
    "_manufacturerItem": "Mfg. Item",
    "_purchasing": "Purchasing",
    "_purchaseEmailProfile": "Purchase Email Profile",
    "_purchaseEmailProfiles": "Purhase Email",
    "_purchaseOrder": "Purchase Order",
    "_purchaseOrderLine": "Purchase Order Line",
    "_purchaseOrderWorkflow": "Purchase Workflow",
    "_purchaseOrders": "Purchase Orders",
    "_purchaseType": "Purchase Type",
    "_purchaseTypes": "Purchase Types",
    "_releaseDate": "Release Date",
    "_unitRatio": "Unit Ratio",
    "_vendorItem": "Vendor Item",
    "_vouchered": "Vouchered"
  });

  if (typeof exports !== 'undefined') {
    exports.language = lang;
  }
}());
