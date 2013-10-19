/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, Globalize:true, enyo:true, _:true */

(function () {

  /**
    @name XV.Number
    @class An input control for validating and formatting string input that represent a number.<br />
    The superkind of {@link XV.NumberWidget}.
    @extends XV.Input
   */
  enyo.kind(
    /** @lends XV.Number# */{
    name: "XV.NumberSpinnerWidget",
    kind: "XV.Input",
    published: {
      maxlength: 3,
      scale: XT.QTY_SCALE,
      formatting: true,
      showSlider: false,
      maxValue: 100,
      label: "",
      showLabel: true
    },
    classes: "spinner",
    components: [
      {kind: "FittableColumns", components: [
        {name: "label", content: "", classes: "xv-label"},
        {kind: "FittableRows", components: [
          {kind: "onyx.Slider", name: "slider", onChange: "sliderChanged", classes: "slider"},
          {kind: "onyx.InputDecorator", classes: "input-decorator", components: [
            {name: "input", kind: "onyx.Input", classes: "xv-subinput", onchange: "inputChanged", onkeydown: "keyDown"},
            {kind: "FittableRows", components: [
              // TODO: replace with font-awesome
              {kind: "onyx.Button", classes: "buttons", content: "+", ontap: "increase"},
              {kind: "onyx.Button", classes: "buttons", content: "-", ontap: "decrease"}
            ]}
          ]}
        ]}
      ]}
    ],

    create: function () {
      this.inherited(arguments);
      this.$.slider.setShowing(this.showSlider);
      this.labelChanged();
      this.showLabelChanged();
    },

    sliderChanged: function (inSender, inEvent) {
      this.$.input.setValue(Math.round(inSender.getValue()));
    },

    decrease: function (inSender, inEvent) {
      var value = Math.max(parseInt(this.$.input.getValue() || 0, 10) - 1, 0);
      this.$.input.setValue(value);
      this.setSliderValue();
    },

    disabledChanged: function () {
      this.inherited(arguments);
      this.$.label.addRemoveClass("disabled", this.getDisabled());
    },

    increase: function (inSender, inEvent) {
      var value = Math.min(parseInt(this.$.input.getValue() || 0, 10) + 1, this.getMaxValue());
      this.$.input.setValue(value);
      this.setSliderValue();
    },

    setSliderValue: function () {
      this.$.slider.setValue(this.$.input.getValue());
    },

    /**
    @todo Document the setValue method.
    */
    setValue: function (value, options) {
      // use isNaN here because this value could be a number String, 0 value, or null
      // only want to set value as null in cases of bad strings and null/undefined
      value = value !== null && !isNaN(value) ? XT.math.round(value, this.getScale()) : null;
      this.setSliderValue();
      XV.Input.prototype.setValue.call(this, value, options);
    },
    /**
      Determines whether the user input is numeric.
      Validates value, whether set programatically or via user input. Gracefully handles
      commas, periods, etc per the set culture using Globalize.

      @param {String} Number (string) to be validated.
      @return The value if it is valid, otherwise false.
     */
    validate: function (value) {
      // this takes the string from the input field and parses it (including understanding commas, which isNaN cannot)
      // if it cannot parse the value, it returns NaN
      value = Globalize.parseFloat(value);

      // use isNaN here because parseFloat could return NaN
      // if you pass NaN into _.isNumber, it will misleadingly return true
      // only bad string and null/undefined cases do we want to fail validation
      return isNaN(value) ? false : value;
    },
    /**
     @todo Document the valueChanged method.
     */
    valueChanged: function (value) {
      // use isNaN here because this value could be a number String, 0 value, or null
      // only in bad string and null/undefined cases do we want to return an empty string
      if (!isNaN(value)) {
        value = this.formatting ? Globalize.format(value, "n" + this.getScale()) : value;
      } else {
        value = "";
      }
      return XV.Input.prototype.valueChanged.call(this, value);
    },

    /**
     @todo Document the labelChanged method.
     */
    labelChanged: function () {
      var label = (this.getLabel() || ("_" + this.attr + "").loc()) + ":";
      this.$.label.setContent(label);
    },
    /**
     @todo Document the showLabelChanged method.
     */
    showLabelChanged: function () {
      if (this.getShowLabel()) {
        this.$.label.show();
      } else {
        this.$.label.hide();
      }
    }
  });

}());
