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
    kind: "XV.NumberWidget",
    name: "XV.MoneyWidget",
    classes: "xv-moneywidget",
    published: {
      scale: XT.MONEY_SCALE,
      amount: null,
      currency: null,
      effective: null,
      currencyDisabled: false,
      currencyShowing: true
    },
    handlers: {
      onSelect: "inputChanged"
    },
    components: [
      {kind: "FittableColumns", components: [
        {name: "label", content: "", classes: "xv-label"},
        {kind: "onyx.InputDecorator", classes: "xv-input-decorator",
            components: [
          {name: "input", kind: "onyx.Input", attr: "amount", onchange: "inputChanged", onkeydown: "keyDown"}
        ]},
        {name: "picker", kind: "XV.CurrencyPicker", attr: "currency"}
      ]},
      {kind: "FittableColumns", name: "basePanel", showing: false, components: [
        {name: "spacer", content: "", classes: "xv-label"},
        {kind: "onyx.InputDecorator", classes: "xv-input-decorator", components: [
          {name: "baseAmount"}
        ]},
        {kind: "onyx.InputDecorator", classes: "xv-input-decorator", components: [
          {name: "baseLabel"}
        ]}
      ]}
    ],
    /**
      If the effective date is provided, the fixedRate is set and the
      base panel is shown.
     */
    create: function () {
      this.inherited(arguments);
      this.$.picker.setDisabled(this.getCurrencyDisabled());
      this.$.picker.setShowing(this.getCurrencyShowing());
      if (this.getEffective()) {
        this.$.basePanel.setShowing(true);
        this.$.baseLabel.setContent(XT.baseCurrency().get('abbreviation'));
      }
    },
    /**
      Returns the published effective value.
     */
    getEffective: function () {
      return this.effective;
    },

    /**
      Returns the published currency value.
     */
    getCurrency: function () {
      return this.currency;
    },

    /**
      Sets the value of the published currency value.
     */
    setCurrency: function (value) {
      this.currency = value;
    },

    /**
      Returns the published amount value.
     */
    getAmount: function () {
      return this.amount;
    },

    /**
    Sets the value of the published currency value.
    */
    setAmount: function (value) {
      this.amount = value;
    },

    setBaseAmount: function (value) {
      var amt = value * this.getFixedRate(this.getEffective(), this.getCurrency());
      amt = amt || amt === 0 ? Globalize.format(amt, "n" + this.getScale()) : "";
      this.$.baseAmount.setContent(amt);
    },

    /**
    If the effective date is available,
    calculate the base currency amount based on the fixed rate
    when the amount or currency are changed.
    */
    inputChanged: function (inSender, inEvent) {
      if (this.effective) {
        var input = this.$.input.getValue(),
          value = this.validate(input);
        // Set base label with calculated value
        this.setBaseAmount(value);
      }
    },

    /**
    This setDisabled function is all or nothing for both widgets
    depending on value
    */
    setDisabled: function (isDisabled) {
      this.$.input.setDisabled(isDisabled);
      this.$.picker.setDisabled(this.currencyDisabled || isDisabled);
    },

    /**
    This setValue function handles a value which is an
      object consisting of two key/value pairs for the
      amount and currency controls.
    */
    setValue: function (value, options) {
      options = options || {};
      var oldValue, inEvent;
      for (var attribute in value) {
        if (value.hasOwnProperty(attribute)) {
          if (attribute === "amount") {
            oldValue = this.amount;
            if (oldValue !== value[attribute]) {
              this.setAmount(value[attribute]);
              this.valueChanged(value[attribute]);
              inEvent = { value: value[attribute], originator: this };
              if (!options.silent) { this.doValueChange(inEvent); }
              // Set base label with calculated value
              this.setBaseAmount(value[attribute]);
            }
          } else if (attribute === "currency") {
            oldValue = this.getCurrency();
            if (oldValue !== value[attribute]) {
              this.setCurrency(value[attribute]);
              this.$.picker.setValue(value[attribute] || XT.baseCurrency(), options);
              // Set base label with calculated value
              this.setBaseAmount(this.getAmount());
            }
          }
        }
      }
    },

    /**
     Retrieves the fixed currency rate using the current currency and effective date.
     */
    getFixedRate: function (effDate, curr) {
      if (!curr) { curr = XT.baseCurrency(); }
      var rate = null;
      rate = _.find(XM.currencyRates.models, function (currRate) {
        return (currRate.get('currency') === curr.get('id')) &&
          (effDate > currRate.get('effective') && effDate < currRate.get('expires'));
      });
      return rate ? rate.get('rate') : null;
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
