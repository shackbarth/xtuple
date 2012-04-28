// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT global */

sc_require('ext/session');

var Money, Quantity, QuantityPer, Cost, SalesPrice, PurchasePrice, Percent,
    UnitRatio, Weight, SharedNumericPrototoype;

/** 
  @class 

  Special number objects used for number formatting in transforms.
*/

SharedNumericPrototoype = {
  valueOf: function()  {  return this.val; },
  toString: function() {  return this.val.toFixed(this.scale); },
  toLocaleString: function() {
    var n = 'n'+XT.session.locale.get(this.localeScale);
    return Globalize.format(this.val, n);
  }
};

/** private */
_xt_toCurrencyLocale = function() {
  var c = 'c'+XT.session.locale.get(this.localeScale);
  return Globalize.format(this.val, c);
}

Money = global.Money = function(val) { this.val = +val.toFixed(this.scale); };
Money.prototype = SC.beget(SharedNumericPrototoype);
Money.prototype.constructor = Money;
Money.displayName = '_money'.loc();
Money.prototype.displayName = '_money'.loc();
Money.isNumeric = true;
Money.prototype.scale = XT.MONEY_SCALE;
Money.prototype.localeScale = 'currencyScale';
Money.prototype.toLocaleString = _xt_toCurrencyLocale;

Quantity = global.Quantity = function(val) { this.val = +val.toFixed(this.scale); };
Quantity.prototype = SC.beget(SharedNumericPrototoype);
Quantity.prototype.constructor = Quantity;
Quantity.displayName = '_quantity'.loc();
Quantity.prototype.displayName = '_quantity'.loc();
Quantity.isNumeric = true;
Quantity.prototype.scale = XT.QTY_SCALE;
Quantity.prototype.localeScale = 'qtyScale';

QuantityPer = global.QuantityPer = function(val) { this.val = +val.toFixed(this.scale); };
QuantityPer.prototype = SC.beget(SharedNumericPrototoype);
QuantityPer.prototype.constructor = QuantityPer;
QuantityPer.displayName = '_quantityPer'.loc();
QuantityPer.prototype.displayName = 'quantityPer'.loc();
QuantityPer.isNumeric = true;
QuantityPer.prototype.scale = XT.QTY_PER_SCALE;
QuantityPer.prototype.localeScale = 'qtyPerScale';

Cost = global.Cost = function(val) { this.val = +val.toFixed(this.scale); };
Cost.prototype = SC.beget(SharedNumericPrototoype);
Cost.prototype.constructor = Cost;
Cost.displayName = '_cost'.loc();
Cost.prototype.displayName = '_cost'.loc();
Cost.isNumeric = true;
Cost.prototype.scale = XT.COST_SCALE;
Cost.prototype.localeScale = 'costScale';
Cost.prototype.toLocaleString = _xt_toCurrencyLocale;

SalesPrice = global.SalesPrice = function(val) { this.val = +val.toFixed(this.scale); };
SalesPrice.prototype = SC.beget(SharedNumericPrototoype);
SalesPrice.prototype.constructor = SalesPrice;
SalesPrice.displayName = 'salesPrice'.loc();
SalesPrice.prototype.displayName = 'salesPrice'.loc();
SalesPrice.isNumeric = true;
SalesPrice.prototype.scale = XT.SALES_PRICE_SCALE;
SalesPrice.prototype.localeScale = 'salesPriceScale';
SalesPrice.prototype.toLocaleString = _xt_toCurrencyLocale;

PurchasePrice = global.PurchasePrice = function(val) { this.val = +val.toFixed(this.scale); };
PurchasePrice.prototype = SC.beget(SharedNumericPrototoype);
PurchasePrice.prototype.constructor = PurchasePrice;
PurchasePrice.displayName = '_purchasePrice'.loc();
PurchasePrice.prototype.displayName = '_purchasePrice'.loc();
PurchasePrice.isNumeric = true;
PurchasePrice.prototype.scale = XT.PURCHASE_PRICE_SCALE;
PurchasePrice.prototype.localeScale = 'purchasePriceScale';
PurchasePrice.prototype.toLocaleString = _xt_toCurrencyLocale;

ExtendedPrice = global.PurchasePrice = function(val) { this.val = +val.toFixed(this.scale); };
ExtendedPrice.prototype = SC.beget(SharedNumericPrototoype);
ExtendedPrice.prototype.constructor = PurchasePrice;
ExtendedPrice.displayName = '_extendedPrice'.loc();
ExtendedPrice.prototype.displayName = '_extendedPrice'.loc();
ExtendedPrice.isNumeric = true;
ExtendedPrice.prototype.scale = XT.EXTENDED_PRICE_SCALE;
ExtendedPrice.prototype.localeScale = 'extPriceScale';
ExtendedPrice.prototype.toLocaleString = _xt_toCurrencyLocale;

Percent = global.Percent = function(val) { this.val = +val.toFixed(this.scale); };
Percent.prototype = SC.beget(SharedNumericPrototoype);
Percent.prototype.constructor = Percent;
Percent.displayName = '_percent'.loc();
Percent.prototype.displayName = '_percent'.loc();
Percent.isNumeric = true;
Percent.prototype.scale = XT.PERCENT_SCALE;
Percent.prototype.localeScale = 'percentScale';
Percent.prototype.toLocaleString = function() {
  var p = 'p'+XT.session.locale.get(this.localeScale);
  return Globalize.format(this.val, p);
};

UnitRatio = global.UnitRatio = function(val) { this.val = +val.toFixed(this.scale); };
UnitRatio.prototype = SC.beget(SharedNumericPrototoype);
UnitRatio.prototype.constructor = UnitRatio;
UnitRatio.displayName = '_unitRatio';
UnitRatio.prototype.displayName = '_unitRatio'.loc();
UnitRatio.isNumeric = true;
UnitRatio.prototype.scale = XT.UNIT_RATIO_SCALE;
UnitRatio.prototype.localeScale = 'unitRatioScale';

Weight = global.Weight = function(val) { this.val = +val.toFixed(this.scale); };
Weight.prototype = SC.beget(SharedNumericPrototoype);
Weight.prototype.constructor = Weight;
Weight.displayName = '_weight';
Weight.prototype.displayName = '_weight'.loc();
Weight.isNumeric = true;
Weight.prototype.scale = XT.WEIGHT_SCALE;
Weight.prototype.localeScale = 'unitRatioScale';

/**
  Implementation of round on number that accepts a decimal places number as a
  argument to calculate scale. Rounds to `scale` if none specified.
  
  @param {Number} decimal places
  @returns {Number}
*/
Number.prototype.round = function(decimalPlaces) {
  return +this.toFixed(decimalPlaces || this.scale);
}

/**
  The default scale for `round` if no scale specified.
  
  @constant
  @default 0
*/
Number.prototype.scale = 0;
Number.prototype.toMoney = function() { return new Money(this) };
Number.prototype.toQuantity = function() { return new Quantity(this) };
Number.prototype.toQuantityPer = function() { return new QuantityPer(this) };
Number.prototype.toCost = function() { return new Cost(this) };
Number.prototype.toSalesPrice = function() { return new SalesPrice(this) };
Number.prototype.toPurchasePrice = function() { return new PurchasePrice(this) };
Number.prototype.toExtendedPrice = function() { return new ExtendedPrice(this) };
Number.prototype.toPercent = function() { return new Percent(this) };
Number.prototype.toUnitRatio = function() { return new UnitRatio(this) };
Number.prototype.toWeight = function() { return new Weight(this) };
