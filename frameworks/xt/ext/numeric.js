/*globals global */

var Money, Quantity, QuantityPer, Cost, SalesPrice, PurchasePrice, Percent,
    UnitRatio, Weight, SharedNumericPrototoype;

/** 
  @class 

  Special number objects used for number formatting in transforms.
*/

SharedNumericPrototoype = {
  valueOf: function()  {  return this.val; },
  toString: function() {  return this.val.toFixed(this.precision); }
};

Money = global.Money = function(val) { this.val = +val.toFixed(this.precision); };
Money.prototype = SC.beget(SharedNumericPrototoype);
Money.prototype.constructor = Money;
Money.prototype.precision = XT.MONEY_SCALE;

Quantity = global.Quantity = function(val) { this.val = +val.toFixed(this.precision); };
Quantity.prototype = SC.beget(SharedNumericPrototoype);
Quantity.prototype.constructor = Quantity;
Quantity.prototype.precision = XT.QTY_SCALE;

QuantityPer = global.QuantityPer = function(val) { this.val = +val.toFixed(this.precision); };
QuantityPer.prototype = SC.beget(SharedNumericPrototoype);
QuantityPer.prototype.constructor = QuantityPer;
QuantityPer.prototype.precision = XT.QTY_PER_SCALE;

Cost = global.Cost = function(val) { this.val = +val.toFixed(this.precision); };
Cost.prototype = SC.beget(SharedNumericPrototoype);
Cost.prototype.constructor = Cost;
Cost.prototype.precision = XT.COST_SCALE;

SalesPrice = global.SalesPrice = function(val) { this.val = +val.toFixed(this.precision); };
SalesPrice.prototype = SC.beget(SharedNumericPrototoype);
SalesPrice.prototype.constructor = SalesPrice;
SalesPrice.prototype.precision = XT.SALES_PRICE_SCALE;

PurchasePrice = global.PurchasePrice = function(val) { this.val = +val.toFixed(this.precision); };
PurchasePrice.prototype = SC.beget(SharedNumericPrototoype);
PurchasePrice.prototype.constructor = PurchasePrice;
PurchasePrice.prototype.precision = XT.PURCHASE_PRICE_SCALE;

ExtendedPrice = global.PurchasePrice = function(val) { this.val = +val.toFixed(this.precision); };
ExtendedPrice.prototype = SC.beget(SharedNumericPrototoype);
ExtendedPrice.prototype.constructor = PurchasePrice;
ExtendedPrice.prototype.precision = XT.EXTENDED_PRICE_SCALE;

Percent = global.Percent = function(val) { this.val = +val.toFixed(this.precision); };
Percent.prototype = SC.beget(SharedNumericPrototoype);
Percent.prototype.constructor = Percent;
Percent.prototype.precision = XT.PERCENT_SCALE;

UnitRatio = global.UnitRatio = function(val) { this.val = +val.toFixed(this.precision); };
UnitRatio.prototype = SC.beget(SharedNumericPrototoype);
UnitRatio.prototype.constructor = UnitRatio;
UnitRatio.prototype.precision = XT.UNIT_RATIO_SCALE;

Weight = global.Weight = function(val) { this.val = +val.toFixed(this.precision); };
Weight.prototype = SC.beget(SharedNumericPrototoype);
Weight.prototype.constructor = Weight;
Weight.prototype.precision = XT.WEIGHT_SCALE;

/**
  Implementation of round on number that accepts a decimal places number as a
  argument to calculate precision. Rounds to `precision` if no precision specified.
  
  @param {Number} decimal places
  @returns {Number}
*/
Number.prototype.round = function(decimalPlaces) {
  return this.toFixed(decimalPlaces || this.precision) - 0;
}

/**
  The default precision for `round` if no precision specified.
  
  @constant
  @default 0
*/
Number.prototype.precision = 0;
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
