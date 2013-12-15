/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
strict:true, trailing:true, white:true */
/*global XT:true */

// Place strings you want to localize here.  In your app, use the key and
// localize it using "key string".loc().  HINT: For your key names, use the
// english string with an underscore in front.  This way you can still see
// how your UI will look and you'll notice right away when something needs a
// localized string added to this file!

(function () {
  "use strict";

  var lang = XT.stringsFor("en_US", {
    // Core Errors
    "_attributeNotInSchema": "'{attr}' does not exist in the schema.",
    "_attributeIsRequired": "{attr} is required.",
    "_attributeReadOnly": "Can not edit read only attribute(s).",
    "_attributeTypeMismatch": "The value of '{attr}' must be type: {type}.",
    "_canNotUpdate": "Insufficient privileges to edit the record.",
    "_datasourceError": "Data source error: {error}",
    "_invalidValue": "Invalid value for {attr}: {value}.",
    "_lengthInvalid": "Length of {attr} must be {length}.",
    "_lineItemsRequired": "You must create at least one line item.",
    "_localResourceNotAllowed": "Not allowed to load local resource",
    "_recordNotFound": "Record not found.",
    "_recordStatusNotEditable": "Record with status of `{status}` is not editable.",
    "_saveFirst": "You must save your changes before performing this action.",
    "_valueExists": "Record with {attr} of '{value}' already exists.",

    // Application errors (move up to enyo client?)
    "_addressShared": "There are multiple records sharing this Address.",
    "_assignedToRequiredAssigned": "Assigned to is required when status is 'Assigned'",
    "_canNotCreateOrderOnCreditWarn": "You do not have permission to create orders for customers on credit warning.",
    "_canNotCreateOrderOnCreditHold": "You do not have permission to create orders for customers on credit hold.",
    "_characteristicContextRequired": "You must set at least one characteristic context to true.",
    "_countryInvalid": "Country is invalid.",
    "_currencyRateNotFound": "No currency conversion rate was found for {currency} on {asOf}.",
    "_duplicateValues": "Duplicate values are not allowed.",
    "_endPriorToStart" : "{start} Date must be prior to {end} Date.",
    "_incompleteDistribution": "The quantity distributed must be equal to the transaction quantity.",
    "_invalidAddress": "Invalid Address",
    "_itemSiteActiveItemInactive": "This Item Site refers to an inactive Item and must be marked as inactive.",
    "_itemSiteActiveQtyOnHand": "This Item Site has a quantity on hand and must be marked as active.",
    "_nameRequired": "A name is required.",
    "_negativeQuantityNoAverage": "You can not change an Item Site to Average Costing when it has a negative quantity on hand",
    "_notFractional": "The unit of measure for this item does not allow fractional quantities.",
    "_orderWithActivityNoUnrelease": "The order may not be changed to Unreleased because it has transactional history.",
    "_passwordsDoNotMatch": "Passwords do not Match",
	"_productCategoryRequiredOnSold": "A Product Category is required for sold items.",
    "_quantityMustBePositive": "Quantity must be a positive value.",
	"_recursiveParentDisallowed": "Record is not allowed to reference itself as the parent.",
    "_stockedMustReorder": "You must set a reorder level for a stocked item.",
    "_totalMustBePositive": "The total must be a positive value."
  });

  if (typeof exports !== 'undefined') {
    exports.language = lang;
  }
}());
