/*globals global */

var Money, Quantity, QuantityPer, Cost, SalesPrice, PurchasePrice, Percent,
    UnitRatio, Weight, SharedNumericPrototoype;

/** 
  @class 

  Special number objects used for number formatting in transforms.
*/

SharedNumericPrototoype = {
  valueOf: function()  {  return this.val; },
  toString: function() {  return "" + this.val; }
};

Money = global.Money = function(val) { this.val = val; };
Money.prototype = SC.beget(SharedNumericPrototoype);
Money.prototype.constructor = Money;

Quantity = global.Quantity = function(val) { this.val = val; };
Quantity.prototype = SC.beget(SharedNumericPrototoype);
Quantity.prototype.constructor = Quantity;

QuantityPer = global.QuantityPer = function(val) { this.val = val; };
QuantityPer.prototype = SC.beget(SharedNumericPrototoype);
QuantityPer.prototype.constructor = QuantityPer;

Cost = global.Cost = function(val) { this.val = val; };
Cost.prototype = SC.beget(SharedNumericPrototoype);
Cost.prototype.constructor = Cost;

SalesPrice = global.SalesPrice = function(val) { this.val = val; };
SalesPrice.prototype = SC.beget(SharedNumericPrototoype);
SalesPrice.prototype.constructor = SalesPrice;

PurchasePrice = global.PurchasePrice = function(val) { this.val = val; };
PurchasePrice.prototype = SC.beget(SharedNumericPrototoype);
PurchasePrice.prototype.constructor = PurchasePrice;

Percent = global.Percent = function(val) { this.val = val; };
Percent.prototype = SC.beget(SharedNumericPrototoype);
Percent.prototype.constructor = Percent;

UnitRatio = global.UnitRatio = function(val) { this.val = val; };
UnitRatio.prototype = SC.beget(SharedNumericPrototoype);
UnitRatio.prototype.constructor = UnitRatio;

Weight = global.Weight = function(val) { this.val = val; };
Weight.prototype = SC.beget(SharedNumericPrototoype);
Weight.prototype.constructor = Weight;
