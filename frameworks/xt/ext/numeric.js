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
Money.displayName = 'Money';
Money.prototype.displayName = 'Money';
Money.isNumeric = true;

Quantity = global.Quantity = function(val) { this.val = val; };
Quantity.prototype = SC.beget(SharedNumericPrototoype);
Quantity.prototype.constructor = Quantity;
Quantity.displayName = 'Quantity';
Quantity.prototype.displayName = 'Quantity';
Quantity.isNumeric = true;

QuantityPer = global.QuantityPer = function(val) { this.val = val; };
QuantityPer.prototype = SC.beget(SharedNumericPrototoype);
QuantityPer.prototype.constructor = QuantityPer;
QuantityPer.displayName = 'QuantityPer';
QuantityPer.prototype.displayName = 'QuantityPer';
QuantityPer.isNumeric = true;

Cost = global.Cost = function(val) { this.val = val; };
Cost.prototype = SC.beget(SharedNumericPrototoype);
Cost.prototype.constructor = Cost;
Cost.displayName = 'Cost';
Cost.prototype.displayName = 'Cost';
Cost.isNumeric = true;

SalesPrice = global.SalesPrice = function(val) { this.val = val; };
SalesPrice.prototype = SC.beget(SharedNumericPrototoype);
SalesPrice.prototype.constructor = SalesPrice;
SalesPrice.displayName = 'SalesPrice';
SalesPrice.prototype.displayName = 'SalesPrice';
SalesPrice.isNumeric = true;

PurchasePrice = global.PurchasePrice = function(val) { this.val = val; };
PurchasePrice.prototype = SC.beget(SharedNumericPrototoype);
PurchasePrice.prototype.constructor = PurchasePrice;
PurchasePrice.displayName = 'PurchasePrice';
PurchasePrice.prototype.displayName = 'PurchasePrice';
PurchasePrice.isNumeric = true;

Percent = global.Percent = function(val) { this.val = val; };
Percent.prototype = SC.beget(SharedNumericPrototoype);
Percent.prototype.constructor = Percent;
Percent.displayName = 'Percent';
Percent.prototype.displayName = 'Percent';
Percent.isNumeric = true;

UnitRatio = global.UnitRatio = function(val) { this.val = val; };
UnitRatio.prototype = SC.beget(SharedNumericPrototoype);
UnitRatio.prototype.constructor = UnitRatio;
UnitRatio.displayName = 'UnitRatio';
UnitRatio.prototype.displayName = 'UnitRatio';
UnitRatio.isNumeric = true;

Weight = global.Weight = function(val) { this.val = val; };
Weight.prototype = SC.beget(SharedNumericPrototoype);
Weight.prototype.constructor = Weight;
Weight.displayName = 'Weight';
Weight.prototype.displayName = 'Weight';
Weight.isNumeric = true;
