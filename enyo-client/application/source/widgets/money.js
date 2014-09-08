/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, XM:true, Globalize:true, enyo:true, _:true */

(function () {

  /**
    The widget is created with an attr value that is an object composed of two key-values pairs.
    These pairs include the amount (localValue or baseValue) and the currency attribute strings from the model.
    The workspace replaces the attribute name string value
    The localValue key should be used if the model stores the local currency and the baseValue key should
    be used if the models stores the base currency.
    The effective attribute should contain the date by which calculations
   */
  enyo.kind({
    name: "XV.MoneyWidget",
    kind: "XV.NumberWidget",
    classes: "xv-moneywidget",
    published: {
      scale: XT.MONEY_SCALE,
      localValue: null, // {Number} the number in the user field
      baseValue: null, // {Number} the amount in the base currency
      effective: null,
      currency: null,
      currencyDisabled: false,
      currencyShowing: true,
      disabled: false,
      localMode: true,
      isEditableProperty: "localValue" // The property mapped to an attribute that checks whether editbale
    },
    handlers: {
      onValueChange: "pickerChanged" // intercept picker events
    },
    maxlength: 12,
    components: [
      {controlClasses: "enyo-inline", components: [
        {name: "label", content: "", classes: "xv-label"},
        {kind: "onyx.InputDecorator", components: [
          {name: "input", kind: "onyx.Input",
            onchange: "inputChanged", onkeydown: "keyDown"}
        ]},
        {name: "picker", kind: "XV.CurrencyPicker", classes: "xv-currency-picker", showLabel: false}
      ]},
      {controlClasses: "enyo-inline", name: "basePanel", showing: false, components: [
        {classes: "xv-label"},
        {kind: "onyx.InputDecorator", components: [
          {name: "baseAmountLabel", classes: "xv-label"}
        ]},
        {classes: "xv-currency-picker", components: [
          {kind: 'onyx.InputDecorator', components: [
            {name: 'baseCurrencyLabel'}
          ]}
        ]}
      ]}
    ],
    /**
      Set the base price into the base amount label
    */
    baseValueChanged: function () {
      var localMode = this.getLocalMode(),
        baseValue,
        scale,
        content;
      if (localMode) {
        baseValue = this.getBaseValue();
        scale = this.getScale();
        content = baseValue || baseValue === 0 ?
          Globalize.format(baseValue, "n" + scale) : "";
        this.$.baseAmountLabel.setContent(content);
      } else {
        this.recalculate();
      }
    },

    /**
      If the effective date is provided, the fixedRate is set and the
      base panel is shown.
     */
    create: function () {
      this.inherited(arguments);

      var baseCurrency = XT.baseCurrency();
      if (!baseCurrency) {
        this.bubble("onNotify", {message: "_baseCurrencyMustBeSet".loc()});
      }

      this.setEffective(new Date());
      this.setCurrency(baseCurrency);
      this.setLocalValue(0);
      this.$.baseCurrencyLabel.setContent(baseCurrency.get('abbreviation'));

      // the currency picker may be disabled or hidden on creation in certain situations
      this.currencyDisabledChanged();
      this.currencyShowingChanged();

      // this is for styling of the picker since the PickerWidget has a built in
      // input decorator
      this.$.picker.$.inputWrapper.removeClass("onyx-input-decorator");

      // set the "mode" of this widget, whether or not it directly saves the local
      // value to the model, or if it converts it to and from the base value.
      this.setLocalMode(_.has(this.getAttr(), "localValue"));
    },

    clear: function (options) {
      this.setValue({localValue: null}, options);
    },

    currencyChanged: function () {
      this.$.picker.setValue(this.getCurrency(), {silent: true});
      this.recalculate();
    },

    currencyDisabledChanged: function () {
      this.$.picker.setDisabled(this.getCurrencyDisabled());
    },

    currencyShowingChanged: function () {
      this.$.picker.setShowing(this.getCurrencyShowing());
    },

    /**
      This setDisabled function is all or nothing for both widgets
      depending on value
    */
    disabledChanged: function () {
      var disabled = this.getDisabled(),
        currencyDisabled = this.getCurrencyDisabled();
      this.$.input.setDisabled(disabled);
      this.$.picker.setDisabled(disabled || currencyDisabled);
      this.$.label.addRemoveClass("disabled", this.getDisabled());
    },

    /**
    @todo Document the labelChanged method.
    */
    labelChanged: function () {
      var attr = this.getAttr(),
        valueAttr = attr.localValue || attr.baseValue;
      var label = (this.getLabel() || ("_" + valueAttr || "").loc());
      this.$.label.setContent(label + ":");
    },

    effectiveChanged: function () {
      this.recalculate();
    },

    localValueChanged: function () {
      this.valueChanged(this.getLocalValue()); // forward to XV.Number default for formatting
      this.recalculate();
    },

    recalculate: function () {
      var localMode = this.getLocalMode(),
        value = localMode ? this.getLocalValue() : this.getBaseValue(),
        request = localMode ? "toBase" : "fromBase",
        setter = localMode ? "setBaseValue" : "setLocalValue",
        currency = this.getCurrency(),
        effective = this.getEffective(),
        showing = localMode && _.isDate(effective) && currency &&
          !currency.get("isBase"),
        options = {},
        that = this,
        i;

      if (!currency || !effective) { return; }

      // Keep track of requests, we'll ignore stale ones
      this._counter = _.isNumber(this._counter) ? this._counter + 1 : 0;
      i = this._counter;

      if (_.isNumber(value)) {
        if (currency.get("isBase")) {
         // we're at base, so just set the fields with the base value we have
          this[setter](value);
        } else {
          options.success = function (calcValue) {
            // I only smell freshness
            if (i < that._counter) { return; }
            that[setter](calcValue);
          };
          currency[request](value, effective, options);
        }
      } else { // amount is null
        that[setter](null);
      }

      this.$.basePanel.setShowing(showing);
    },

    setDisabled: function (isDisabled) {
      this.inherited(arguments);
      this.$.picker.setDisabled(isDisabled || this.getCurrencyDisabled());
    },

    /**
      This setValue function handles a value which is an
      object potentially consisting of multiple key/value pairs for the
      amount and currency controls.

      @param {Object} Value
      @param {Object} [value.currency] Currency
      @param {Date} [value.effective] Effective date
      @param {Number} [value.localValue] Local value
      @param {Number} [value.baseValue] Base value
    */
    setValue: function (value, options) {
      options = options || {};
      var attr = this.getAttr(),
        changed = {},
        keys = _.keys(value),
        key,
        set,
        i;

      // Loop through the properties and update calling
      // appropriate "set" functions and add to "changed"
      // object if applicable
      for (i = 0; i < keys.length; i++) {
        key = keys[i];
        set = 'set' + key.slice(0, 1).toUpperCase() + key.slice(1);
        this[set](value[key]);
        if (attr[key]) {
          changed[attr[key]] = value[key];
        }
      }

      // Bubble changes if applicable
      if (!_.isEmpty(changed) && !options.silent) {
        this.doValueChange({value: changed});
      }
    },

    inputChanged: function (inSender, inEvent) {
      var input = this.$.input.getValue(),
        value = this.validate(input),
        prop = this.getLocalMode() ? 'localValue' : 'baseValue',
        obj = {};
      if (value !== false) {
        // is valid!
        obj[prop] = value;
        this.setValue(obj);
      } else {
        // is invalid!
        obj[prop] = null;
        this.setValue(obj);
        this.valueChanged("");
      }
    },

    /**
      Intercept the valueChanged event from picker.
    */
    pickerChanged: function (inSender, inEvent) {
      var value;
      if (inEvent.originator.name === "picker") {
        value = XM.currencies.get(inEvent.value);
        this.setValue({currency: value});
        return true;
      }
    }
  });

}());
