/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  var lang = XT.stringsFor("en_US", {
    "_CopyPRtoPOItem": "Copy to Order",
    "_DefaultPrintPOOnSave": "Print on Save",
    "_defaultShipVia": "Default Ship Via",
    "_earliestDate": "Earliest Date",
    "_freightSubtotal": "Freight Subtotal",
    "_itemSource": "Item Source",
    "_itemSourceItemInactive": "Item Source can not be active when Item is inactive",
    "_itemSources": "Item Sources",
    "_isDropShip": "Drop Ship",
    "_maintainPurchaseOrders": "Maintain Purchase Orders",
    "_maintainPurchaseEmailProfiles": "Maintain Purchase Email Profiles",
    "_maintainPurchaseTypes": "Maintain Purchase Types",
    "_manufacturer": "Manufacturer",
    "_manufacturerItem": "Mfg. Item",
    "_na": "N/A",
    "_noManufacturerNumber": "No Manufacturer Item Number",
    "_noVendorNumber": "No Vendor Item Number",
    "_priceType": "Price Type",
    "_purchase": "Purchase",
    "_purchasing": "Purchasing",
    "_purchaseEmailProfile": "Purchase Email Profile",
    "_purchaseEmailProfiles": "Purchase Email",
    "_purchaseOrder": "Purchase Order",
    "_purchaseOrderLine": "Purchase Order Line",
    "_purchaseOrderWorkflow": "Purchase Workflow",
    "_purchaseOrders": "Purchase Orders",
    "_purchaseRequest": "Purchase Request",
    "_purchaseType": "Purchase Type",
    "_purchaseTypes": "Purchase Types",
    "_quantityBreak": "Quantity Break",
    "_releaseDate": "Release Date",
    "_ranking": "Ranking",
    "_RequirePOTax": "Require Tax",
    "_RequireStdCostForPOItem": "Require Standard Cost",
    "_unitRatio": "Unit Ratio",
    "_UseEarliestAvailDateOnPOItem": "Use Earliest Date",
    "_vendorItem": "Vendor Item",
    "_vendorItemNumber": "VendorItemNumber",
    "_vouchered": "Vouchered"
  });

  if (typeof exports !== "undefined") {
    exports.language = lang;
  }
}());
