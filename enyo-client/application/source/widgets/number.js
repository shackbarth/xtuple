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
      // the currency picker may be disabled or hidden on creation in certain situations
      this.$.picker.setDisabled(this.getCurrencyDisabled());
      this.$.picker.setShowing(this.getCurrencyShowing());
      // only show the base panel if there is an effective date AND the currency doesn't match the base
      this.setBasePanelShowing();
    },
    /**
      Returns the published effective value.
     */
    getEffective: function () {
      return this.effective;
    },
    
    /**
      Sets the effective date and sets visibility
      of base panel based on value.
     */
    setEffective: function (value) {
      this.effective = value;
      this.setBasePanelShowing();
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
    
    /**
      Sets visibility of base panel
     */
    setBasePanelShowing: function () {
      var showing = _.isDate(this.getEffective()) && this.getCurrency() && !this.getCurrency().get("isBase");
      this.$.basePanel.setShowing(showing);
      if (showing) {
        this.$.baseLabel.setContent(XT.baseCurrency().get('abbreviation'));
        this.setBaseAmount(this.getAmount());
      }
    },

    setBaseAmount: function (value) {
      var options = {}, amt = value, that = this;
      if (amt) {
        options.success = function (basePrice) {
          amt = basePrice;
          amt = amt || amt === 0 ? Globalize.format(amt, "n" + that.getScale()) : "";
          that.$.baseAmount.setContent(amt);
        };
        that.getCurrency().toBase(amt, that.getEffective(), options);
      }
    },

    /**
    If the effective date is available,
    calculate the base currency amount based on the fixed rate
    when the amount or currency are changed.
    */
    inputChanged: function (inSender, inEvent) {
      // only show the base panel if there is an effect date AND the currency doesn't match the base
      // Set base label with calculated value
      this.setBasePanelShowing();
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
      var oldValue, inEvent, newValue;
      for (var attribute in value) {
        if (value.hasOwnProperty(attribute)) {
          newValue = value[attribute];
          if (attribute === "amount") {
            oldValue = this.amount;
            if (oldValue !== newValue) {
              this.setAmount(newValue);
              this.valueChanged(newValue);
              inEvent = { value: newValue, originator: this };
              if (!options.silent) { this.doValueChange(inEvent); }
            }
          } else if (attribute === "currency") {
            oldValue = this.getCurrency();
            if (oldValue !== newValue) {
              this.setCurrency(newValue || XT.baseCurrency());
              this.$.picker.setValue(this.getCurrency());
            }
          }
          // only show the base panel if there is an effect date AND the currency doesn't match the base
          // Set base label with calculated value
          this.setBasePanelShowing();
        }
      }
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
