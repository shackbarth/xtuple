/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, Globalize:true, enyo:true, _:true */

(function () {

  /**
    @name XV.Number
    @class An input control for validating and formatting string input that represent a number.<br />
    The superkind of {@link XV.NumberWidget}.
    @extends XV.Input
   */
  enyo.kind(/** @lends XV.Number# */{
    name: "XV.Number",
    kind: "XV.Input",
    published: {
      scale: 0,
      formatting: true
    },
    /**
    @todo Document the setValue method.
    */
    setValue: function (value, options) {
      // use isNaN here because this value could be a number String, 0 value, or null
      // only want to set value as null in cases of bad strings and null/undefined
      value = value !== null && !isNaN(value) ? XT.math.round(value, this.getScale()) : null;
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
    }
  });

  /**
    @name XV.NumberWidget
    @class An input control consisting of fittable columns: label, decorator, and input field.<br />
    Use to implement an input field for strings that represents a number, such as prices.  This widget
    includes a style to right-justify the text entered into the input field.
    @extends XV.Number
   */
  enyo.kind(/** @lends XV.NumberWidget# */{
    name: "XV.NumberWidget",
    kind: "XV.Number",
    classes: "xv-inputwidget xv-numberwidget",
    published: {
      label: "",
      showLabel: true,
      placeholder: ""
    },
    components: [
      {kind: "FittableColumns", components: [
        {name: "label", content: "", classes: "xv-label"},
        {kind: "onyx.InputDecorator", classes: "xv-input-decorator",
          components: [
          {name: "input", kind: "onyx.Input", onchange: "inputChanged", onkeydown: "keyDown", type: "number"}
        ]}
      ]}
    ],
    /**
     @todo Document the create method.
     */
    create: function () {
      this.inherited(arguments);
      this.labelChanged();
      this.showLabelChanged();
    },
    /**
     @todo Revisit or remove after enyo fix to ENYO-1104.
     */
    keyDown: function (inSender, inEvent) {
      // XXX hack here (and in other places that reference issue 18397)
      // can be removed once enyo fixes ENYO-1104
      var shadowNone = inEvent.originator.hasClass("text-shadow-none");
      inEvent.originator.addRemoveClass("text-shadow-none", !shadowNone);
      inEvent.originator.addRemoveClass("text-shadow-0", shadowNone);
      // end hack
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
