/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, Globalize:true, enyo:true, _:true */

(function () {

  // ..........................................................
  // COST
  //

  enyo.kind({
    name: "XV.CostWidget",
    kind: "XV.NumberWidget",
    scale: XT.COST_SCALE
  });

  // ..........................................................
  // EXTENDED PRICE
  //

  enyo.kind({
    name: "XV.ExtendedPriceWidget",
    kind: "XV.NumberWidget",
    scale: XT.EXTENDED_PRICE_SCALE
  });

  // ..........................................................
  // HOURS
  //

  enyo.kind({
    name: "XV.HoursWidget",
    kind: "XV.NumberWidget",
    maxlength: 12,
    scale: XT.HOURS_SCALE
  });

  // ..........................................................
  // PERCENT
  //

  enyo.kind({
    name: "XV.PercentWidget",
    kind: "XV.NumberWidget",
    scale: XT.PERCENT_SCALE,
    validate: function (value) {
      // this takes the string from the input field and parses it (including understanding commas, which isNaN cannot)
      // if it cannot parse the value, it returns NaN
      value = Globalize.parseFloat(value);
      // use isNaN here because parseFloat could return NaN
      // if you pass NaN into _.isNumber, it will misleadingly return true
      // only bad string and null/undefined cases do we want to fail validation
      return !isNaN(value) ? value / 100 : false;
    },
    valueChanged: function (value) {
      // use isNaN here because this value may be a number string and _isNaN requires
      // a separate falsy check.
      // In this case, it is ok for 0 to fall to the true case, just not null or a bad string
      value = !isNaN(value) ? value * 100 : value;
      XV.NumberWidget.prototype.valueChanged.call(this, value);
    }
  });

  // ..........................................................
  // PURCHASE PRICE
  //

  enyo.kind({
    name: "XV.PurchasePriceWidget",
    kind: "XV.NumberWidget",
    scale: XT.PURCHASE_PRICE_SCALE
  });

  // ..........................................................
  // QUANTITY
  //

  enyo.kind({
    name: "XV.QuantityWidget",
    kind: "XV.NumberWidget",
    maxlength: 12,
    scale: XT.QTY_SCALE
  });

  // ..........................................................
  // QUANTITY PER
  //

  enyo.kind({
    name: "XV.QuantityPerWidget",
    kind: "XV.NumberWidget",
    scale: XT.QTY_PER_SCALE
  });

  // ..........................................................
  // SALES PRICE
  //

  enyo.kind({
    name: "XV.SalesPriceWidget",
    kind: "XV.NumberWidget",
    scale: XT.SALES_PRICE_SCALE
  });

  // ..........................................................
  // UNIT RATIO
  //

  enyo.kind({
    name: "XV.UnitRatioWidget",
    kind: "XV.NumberWidget",
    scale: XT.UNIT_RATIO_SCALE
  });

  // ..........................................................
  // WEIGHT
  //

  enyo.kind({
    name: "XV.WeightWidget",
    kind: "XV.NumberWidget",
    scale: XT.WEIGHT_SCALE
  });

}());
