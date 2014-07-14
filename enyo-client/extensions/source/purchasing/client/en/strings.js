/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  var lang = XT.stringsFor("en_US", {
    "_activityType": "Activity Type",
    "_correctToEarliestDate?": "The due date does not fall within the lead time for this Item Source. Would you like it corrected?",
    "_correctToMinimumQuantity?": "The quantity is below the minimum order quantity for this Item Source. Would you like it corrected?",
    "_correctToMultipleQuantity?": "The quantity does not fall within the order multiple quantity for this Item Source. Would you like it corrected?",
    "_createSupplyForSalesOrders": "Auto Create for Sales Orders",
    "_CopyPRtoPOItem": "Copy to Order",
    "_DefaultPrintPOOnSave": "Print on Save",
    "_defaultShipVia": "Default Ship Via",
    "_earliestDate": "Earliest Date",
    "_errorStandardCostRequired": "The Item {number} can not be used because has no standard cost.",
    "_freightSubtotal": "Freight Subtotal",
    "_itemSource": "Item Source",
    "_itemSourceItemInactive": "Item Source can not be active when Item is inactive",
    "_itemSources": "Item Sources",
    "_isPurchased": "Purchased",
    "_isDropShip": "Drop Ship",
    "_isMisc": "Miscellaneous",
    "_maintainPurchaseOrders": "Maintain Purchase Orders",
    "_maintainPurchaseEmailProfiles": "Maintain Purchase Email Profiles",
    "_maintainPurchaseTypes": "Maintain Purchase Types",
    "_manufacturer": "Manufacturer",
    "_manufacturerItem": "Mfg. Item",
    "_maximumDesiredCost": "Maximum Cost",
    "_na": "N/A",
    "_noManufacturerNumber": "No Manufacturer Item",
    "_noVendorNumber": "No Vendor Item",
    "_priceType": "Price Type",
    "_purchase": "Purchase",
    "_purchasing": "Purchasing",
    "_purchaseEmailProfile": "Email Profile",
    "_purchaseEmailProfiles": "Purchase Email",
    "_purchaseOrder": "Purchase Order",
    "_purchaseOrderLine": "Purchase Order Line",
    "_purchaseOrderWorkflow": "Purchase Workflow",
    "_purchaseOrders": "Purchase Orders",
    "_purchaseRequest": "Purchase Request",
    "_purchaseRequests": "Purchase Requests",
    "_purchaseType": "Purchase Type",
    "_purchaseTypes": "Purchase Types",
    "_quantityBreak": "Quantity Break",
    "_releaseDate": "Release Date",
    "_ranking": "Ranking",
    "_RequirePOTax": "Require Tax",
    "_RequireStdCostForPOItem": "Require Standard Cost",
    "_transactedPoNotUnreleased": "This Purchase Order has transactions and can not be Unreleased.",
    "_supply": "Supply",
    "_unitRatio": "Unit Ratio",
    "_UseEarliestAvailDateOnPOItem": "Use Earliest Date",
    "_vendorItem": "Vendor Item",
    "_vendorItemNumber": "VendorItemNumber",
    "_vendors": "Vendors",
    "_vendorUnit": "Vendor Unit",
    "_viewPurchaseOrders": "View Purchase Orders",
    "_vouchered": "Vouchered",
    "_warnMaxCostExceeded": "The price is above the maximum desired cost of {maximumDesiredCost} for this Item."
  });

  if (typeof exports !== "undefined") {
    exports.language = lang;
  }
}());
