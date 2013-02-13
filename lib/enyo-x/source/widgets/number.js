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
      scale: 0
    },
    /**
    @todo Document the setValue method.
    */
    setValue: function (value, options) {
      value = _.isNumber(value) ? XT.math.round(value, this.getScale()) : null;
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
      value = Globalize.parseFloat(value);
      return isNaN(value) ? false : value;
    },
    /**
     @todo Document the valueChanged method.
     */
    valueChanged: function (value) {
      value = value || value === 0 ? Globalize.format(value, "n" + this.getScale()) : "";
      return XV.Input.prototype.valueChanged.call(this, value);
    }
  });

  /**
    @name XV.NumberWidget
    @class An input control consisting of fittable columns: label, decorator, and input field.<br />
    Use to implement an input field for strings that represents a number, such as prices.
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
          {name: "input", kind: "onyx.Input", onchange: "inputChanged", onkeydown: "keyDown"}
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
