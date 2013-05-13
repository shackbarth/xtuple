// ==========================================================================
// Project:   XT` Strings
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

// Place strings you want to localize here.  In your app, use the key and
// localize it using "key string".loc().  HINT: For your key names, use the
// english string with an underscore in front.  This way you can still see
// how your UI will look and you'll notice right away when something needs a
// localized string added to this file!
//

XT.stringsFor("en_US", {

  // TODO: All the error translations need to be moved here
	"_saveFirst": "You must save your changes before performing this action.",
	"_currencyRateNotFound": "No currency conversion rate was found for {currency} on {asOf}.",
	"_lineItemsRequired": "You must create at least one line item.",
	"_quantityMustBePositive": "Quantity must be a positive value.",
	"_totalMustBePositive": "The total must be a positive value.",
	"_notFractional": "The unit of measure for this item does not allow fractional quantities."

});

// TODO: Temporary until we get loaded from datasource
XT.locale.setLanguage("en_US");
