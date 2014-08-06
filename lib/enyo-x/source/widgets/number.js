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
    name: "XV.NumberWidget",
    kind: "XV.InputWidget",
    classes: "xv-numberwidget xv-input",
    published: {
      attr: null,
      scale: 0,
      formatting: true,
      label: "",
      showLabel: true
    },
    /**
    @todo Document the setValue method.
    */
    setValue: function (value, options) {
      // use isNaN here because this value could be a number String, 0 value, or null
      // only want to set value as null in cases of bad strings and null/undefined
      value = value !== null && !isNaN(value) ? XT.math.round(value, this.getScale()) : null;
      this.inherited(arguments);
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
      this.inherited(arguments);
    }
  });

}());
