/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, Globalize:true, enyo:true, _:true */

(function () {
  
  // ..........................................................
  // COST
  //
  
  enyo.kind({
    name: "XV.Cost",
    kind: "XV.Number",
    published: {
      scale: XT.COST_SCALE
    }
  });
  
  enyo.kind({
    name: "XV.CostWidget",
    kind: "XV.NumberWidget",
    published: {
      scale: XT.COST_SCALE
    }
  });
  
  // ..........................................................
  // EXTENDED PRICE
  //
  
  enyo.kind({
    name: "XV.ExtendedPrice",
    kind: "XV.Number",
    published: {
      scale: XT.EXTENDED_PRICE_SCALE
    }
  });
  
  enyo.kind({
    name: "XV.ExtendedPriceWidget",
    kind: "XV.NumberWidget",
    published: {
      scale: XT.EXTENDED_PRICE_SCALE
    }
  });
  
  // ..........................................................
  // MONEY
  //
  
  enyo.kind({
    name: "XV.Money",
    kind: "XV.Number",
    published: {
      scale: XT.MONEY_SCALE
    }
  });
  
  enyo.kind({
    name: "XV.MoneyWidget",
    kind: "XV.NumberWidget",
    published: {
      scale: XT.MONEY_SCALE
    }
  });

  // ..........................................................
  // PERCENT
  //
  
  enyo.kind({
    name: "XV.Percent",
    kind: "XV.Number",
    published: {
      scale: XT.PERCENT_SCALE
    },
    getValue: function () {
      return this.value / 100;
    },
    setValue: function (value, options) {
      return XV.Number.prototype.setValue.call(this, value * 100, options);
    },
    validate: function (value) {
      value = this.inherited(arguments);
      return value / 100;
    }
  });
  
  enyo.kind({
    name: "XV.PercentWidget",
    kind: "XV.NumberWidget",
    published: {
      scale: XT.PERCENT_SCALE
    },
    getValue: function () {
      return XV.NumberWidget.prototype.getValue.call(this) * 100;
    },
    setValue: function (value, options) {
      return XV.NumberWidget.prototype.setValue.call(this, value * 100, options);
    },
    validate: function (value) {
      value = this.inherited(arguments);
      return value / 100;
    }
  });
  
  // ..........................................................
  // PURCHASE PRICE
  //
  
  enyo.kind({
    name: "XV.PurchasePrice",
    kind: "XV.Number",
    published: {
      scale: XT.PURCHASE_PRICE_SCALE
    }
  });
  
  enyo.kind({
    name: "XV.PurchasePriceWidget",
    kind: "XV.NumberWidget",
    published: {
      scale: XT.PURCHASE_PRICE_SCALE
    }
  });
  
  // ..........................................................
  // QUANTITY
  //
  
  enyo.kind({
    name: "XV.Quantity",
    kind: "XV.Number",
    published: {
      scale: XT.QTY_SCALE
    }
  });
  
  enyo.kind({
    name: "XV.QuantityWidget",
    kind: "XV.NumberWidget",
    published: {
      scale: XT.QTY_SCALE
    }
  });
  
  // ..........................................................
  // QUANTITY PER
  //
  
  enyo.kind({
    name: "XV.QuantityPer",
    kind: "XV.Number",
    published: {
      scale: XT.QTY_PER_SCALE
    }
  });
  
  enyo.kind({
    name: "XV.QuantityPerWidget",
    kind: "XV.NumberWidget",
    published: {
      scale: XT.QTY_PER_SCALE
    }
  });
  
  // ..........................................................
  // SALES PRICE
  //
  
  enyo.kind({
    name: "XV.SalesPrice",
    kind: "XV.Number",
    published: {
      scale: XT.SALES_PRICE_SCALE
    }
  });
  
  enyo.kind({
    name: "XV.SalesPriceWidget",
    kind: "XV.NumberWidget",
    published: {
      scale: XT.SALES_PRICE_SCALE
    }
  });
  
  // ..........................................................
  // UNIT RATIO
  //
  
  enyo.kind({
    name: "XV.UnitRatio",
    kind: "XV.Number",
    published: {
      scale: XT.UNIT_RATIO_SCALE
    }
  });
  
  enyo.kind({
    name: "XV.UnitRatioWidget",
    kind: "XV.NumberWidget",
    published: {
      scale: XT.UNIT_RATIO_SCALE
    }
  });
  
  // ..........................................................
  // WEIGHT
  //
  
  enyo.kind({
    name: "XV.Weight",
    kind: "XV.Number",
    published: {
      scale: XT.WEIGHT_SCALE
    }
  });
  
  enyo.kind({
    name: "XV.WeightWidget",
    kind: "XV.NumberWidget",
    published: {
      scale: XT.WEIGHT_SCALE
    }
  });

}());
