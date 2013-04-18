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
    scale: XT.COST_SCALE
  });

  enyo.kind({
    name: "XV.CostWidget",
    kind: "XV.NumberWidget",
    scale: XT.COST_SCALE
  });

  // ..........................................................
  // EXTENDED PRICE
  //

  enyo.kind({
    name: "XV.ExtendedPrice",
    kind: "XV.Number",
    scale: XT.EXTENDED_PRICE_SCALE
  });

  enyo.kind({
    name: "XV.ExtendedPriceWidget",
    kind: "XV.NumberWidget",
    scale: XT.EXTENDED_PRICE_SCALE
  });

  // ..........................................................
  // MONEY
  //

  /**
    The widget is created with an attr value that is an object composed of two key-values pairs.
    These pairs include the amount (localValue or baseValue) and the currency attribute strings from the model.
    The workspace replaces the attribute name string value
    The localValue key should be used if the model stores the local currency and the baseValue key should
    be used if the models stores the base currency.
    The effective attribute should contain the date by which calculations
   */
  enyo.kind({
    kind: "XV.NumberWidget",
    name: "XV.MoneyWidget",
    classes: "xv-moneywidget",
    published: {
      scale: XT.MONEY_SCALE,
      localValue: null, // {Number} the number in the user field
      baseValue: null, // {Number} the amount in the base currency
      effective: null,
      currencyDisabled: false,
      currencyShowing: true,
      localMode: true,
      amountAttr: null
    },
    handlers: {
      onValueChange: "valueChanged" // intercepts events from the picker or the field
    },
    components: [
      {kind: "FittableColumns", components: [
        {name: "label", content: "", classes: "xv-label"},
        {kind: "onyx.InputDecorator", classes: "xv-input-decorator",
          components: [
          {name: "input", kind: "onyx.Input", onchange: "inputChanged", onkeydown: "keyDown"}
        ]},
        {name: "picker", kind: "XV.CurrencyPicker",
          attr: "currency", showLabel: false}
      ]},
      {kind: "FittableColumns", name: "basePanel", showing: false,
        components: [
        {name: "spacer", content: "", classes: "xv-label"},
        {kind: "onyx.InputDecorator", classes: "xv-input-decorator",
          components: [
          {name: "baseAmountLabel", classes: "xv-money-label"}
        ]},
        {kind: "onyx.InputDecorator", classes: "xv-input-decorator",
          components: [
          {name: "baseCurrencyLabel", classes: "xv-money-label, currency"}
        ]}
      ]}
    ],
    /**
      If the effective date is provided, the fixedRate is set and the
      base panel is shown.
     */
    create: function () {
      this.inherited(arguments);
      this.$.picker.setValue(XT.baseCurrency(), {silent: true});
      this.$.baseCurrencyLabel.setContent(XT.baseCurrency().get('abbreviation'));
      // the currency picker may be disabled or hidden on creation in certain situations
      this.$.picker.setDisabled(this.getCurrencyDisabled());
      this.$.picker.setShowing(this.getCurrencyShowing());

      // this is for styling of the picker since the PickerWidget has a built in
      // input decorator
      this.$.picker.$.inputWrapper.removeClass("onyx-input-decorator");
      
      // set the "mode" of this widget, whether or not it directly saves the local
      // value to the model, or if it converts it to and from the base value.
      this.setLocalMode(_.has(this.attr, "localValue"));
      if (_.has(this.attr, "localValue")) {
        this.setAmountAttr(this.attr.localValue);
      } else {
        this.setAmountAttr(this.attr.baseValue);
      }
    },

    /**
      Sets visibility of base panel. This panel is shown if there is an effective date and currency
        and the currency is not currently base.
     */
    setBasePanelShowing: function () {
      var currency = this.$.picker.value,
        showing = _.isDate(this.getEffective()) && currency && !currency.get("isBase");
      this.$.basePanel.setShowing(showing);
    },

    /**
      Converts the local value to the base amount and bubbles that value in a new event
     */
    setBase: function (inEvent) {
      var options = {},
        that = this,
        secondEvent,
        amountAttr,
        fromPicker = inEvent.originator.kind === 'XV.CurrencyPicker',
        amount = fromPicker ? this.getLocalValue() : inEvent.value;

      if (amount || amount === 0) {
        options.success = function (basePrice) {
          // set this base price into the model and published field
          that.setBaseValue(basePrice);

          // set this base price into the base amount label
          var amt = basePrice || basePrice === 0 ? Globalize.format(basePrice, "n" + that.getScale()) : "";
          that.$.baseAmountLabel.setContent(amt);

          // if this widget is not in local mode,
          // swap this base price into the event instead of the local price.
          // we do not want to tell the model about the local price.
          // otherwise, it will want to know about local.
          if (fromPicker) {
            // bubble up the change to the picker
            inEvent.transformed = true;
            secondEvent = _.clone(inEvent);
            that.doValueChange(inEvent);

            // also bubble up the transformed change to the amount field
            if (that.getLocalMode()) {
              secondEvent.value = amount;
            } else {
              secondEvent.value = basePrice;
              
            }
            secondEvent.originator = { attr: that.getAmountAttr() };
            that.doValueChange(secondEvent);

          } else {
            // it was the amount field that was changed.
            // only bubble up the change to the amount field
            if (that.getLocalMode()) {
              inEvent.value = amount;
            } else {
              inEvent.value = basePrice;
            }
            inEvent.transformed = true;
            that.doValueChange(inEvent);
          }
        };
        that.$.picker.value.toBase(amount, that.getEffective(), options);
      } else { // amount is null
        that.setBaseValue(null);
        this.$.baseAmountLabel.setContent(null);
      }
    },

    /**
      Converts the base value to the local value and sets this value in the widget
     */
    setLocal: function () {
      var options = {},
        that = this;

      if (this.$.picker.value.get("isBase")) {
        // we're at base, so just set the fields with the base value we have
        this.setLocalValue(this.getBaseValue());
        this.$.input.setValue(this.getBaseValue());
      } else {
        if (this.getBaseValue() || this.getBaseValue() === 0) {
          options.success = function (localAmount) {
            // set this local amount into published and input fields
            that.setLocalValue(localAmount);
            that.$.input.setValue(localAmount);
          };
          options.error = function (err) {
            console.log("error");
          };
          that.$.picker.value.fromBase(this.getBaseValue(), that.getEffective(), options);
        }
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
      amount and currency controls. It will typically be called this
      way by the workspace, with silent:true, and in this case it
      has to appropriately propagate the values to the widgets.

      It can also handle just a number as the value, which it will assume
      to be the amount. The function will be called in this manner
      by the inputChanged function of the base class, and we need to
      have it work correctly in that context as well, mostly just repackaging
      the event as a valueChanged event.
    */
    setValue: function (value, options) {
      var oldValue,
        inEvent,
        fromUser = false,
        newValue;
        
      // supports how this function is used by the base class.
      // assume if we get a number, that means the localValue or baseValue
      if (_.isNumber(value)) {
        fromUser = true;
        if (this.getLocalMode()) {
          value = {localValue: value};
        } else {
          value = {baseValue: value};
        }
      }

      options = options || {};
      for (var attribute in value) {
        if (value.hasOwnProperty(attribute)) {
          newValue = value[attribute];
          if (attribute === "localValue" || attribute === "baseValue") {
            if (fromUser) {
              this.setLocalValue(newValue);
            } else if (this.getLocalMode()) { // this value is in local, don't do any conversions
              this.setLocalValue(newValue);
              this.$.input.setValue(newValue);
            } else { // this value is in base, have to convert to local before setting
              this.setBaseValue(newValue);
              this.setLocal();
            }
            // the subwidget does not know its own attr, but we know what
            // it is because it's stored in our attr hash. substitute it.
            // that's all the workspace needs to know about the originator
            inEvent = { value: newValue, originator: {attr: this.getAmountAttr() }};
            if (!options.silent) { this.doValueChange(inEvent); }
            if (this.getLocalMode()) {
              this.setBase(inEvent);
            }
          } else if (attribute === "currency") {
            oldValue = this.$.picker.value;
            if (newValue && oldValue !== newValue) {
              this.$.picker.setValue(newValue, options);
            }
            // only show the base panel if there is an effective date AND the currency doesn't match the base
            // Set base label with calculated value
            this.setBasePanelShowing();
            // only set local if we're not in local model
            if (!this.getLocalMode()) {
              this.setLocal();
            }
          }
          // set this base price into the base amount label
          var amt = this.getBaseValue() || this.getBaseValue() === 0 ? Globalize.format(this.getBaseValue(), "n" + this.getScale()) : "";
          this.$.baseAmountLabel.setContent(amt);
        }
      }
    },

    /**
      Intercept the valueChanged event and perform the following transformations:
      if the event is coming from the amount field, convert that local amount
      to the base amount.
      If the event is coming from the currency picker, add to it the base amount,
      which needs to be calculated.

      Note that we don't want to catch the event that we ourselves emit after
      we do the transform.
     */
    valueChanged: function (inSender, inEvent) {
      if (!inEvent.transformed) {
        this.setBase(inEvent);
        return true;
      }
    }
  });

  // ..........................................................
  // PERCENT
  //

  enyo.kind({
    name: "XV.Percent",
    kind: "XV.Number",
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
      XV.Number.prototype.valueChanged.call(this, value);
    }
  });

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
    name: "XV.PurchasePrice",
    kind: "XV.Number",
    scale: XT.PURCHASE_PRICE_SCALE
  });

  enyo.kind({
    name: "XV.PurchasePriceWidget",
    kind: "XV.NumberWidget",
    scale: XT.PURCHASE_PRICE_SCALE
  });

  // ..........................................................
  // QUANTITY
  //

  enyo.kind({
    name: "XV.Quantity",
    kind: "XV.Number",
    scale: XT.QTY_SCALE
  });

  enyo.kind({
    name: "XV.QuantityWidget",
    kind: "XV.NumberWidget",
    scale: XT.QTY_SCALE
  });

  // ..........................................................
  // QUANTITY PER
  //

  enyo.kind({
    name: "XV.QuantityPer",
    kind: "XV.Number",
    scale: XT.QTY_PER_SCALE
  });

  enyo.kind({
    name: "XV.QuantityPerWidget",
    kind: "XV.NumberWidget",
    scale: XT.QTY_PER_SCALE
  });

  // ..........................................................
  // SALES PRICE
  //

  enyo.kind({
    name: "XV.SalesPrice",
    kind: "XV.Number",
    scale: XT.SALES_PRICE_SCALE
  });

  enyo.kind({
    name: "XV.SalesPriceWidget",
    kind: "XV.NumberWidget",
    scale: XT.SALES_PRICE_SCALE
  });

  // ..........................................................
  // UNIT RATIO
  //

  enyo.kind({
    name: "XV.UnitRatio",
    kind: "XV.Number",
    scale: XT.UNIT_RATIO_SCALE
  });

  enyo.kind({
    name: "XV.UnitRatioWidget",
    kind: "XV.NumberWidget",
    scale: XT.UNIT_RATIO_SCALE
  });

  // ..........................................................
  // WEIGHT
  //

  enyo.kind({
    name: "XV.Weight",
    kind: "XV.Number",
    scale: XT.WEIGHT_SCALE
  });

  enyo.kind({
    name: "XV.WeightWidget",
    kind: "XV.NumberWidget",
    scale: XT.WEIGHT_SCALE
  });

}());
