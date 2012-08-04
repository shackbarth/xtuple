/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {
  //"use strict";


  // TODO: validate input and complain if invalid
  enyo.kind({
    name: "XV.NumberWidget",
    kind: "enyo.Control",
    numberObject: null,
    components: [
      { kind: "onyx.Input", name: "numberField", onchange: "doFieldChanged", style: "border: 0px; "}
    ],
    create: function () {
      this.inherited(arguments);
      /**
       * the field should inherit the style of the widget. I do this for
       * the width property, which works nicely. It might not work nicely
       * for other properties
       */
      this.$.numberField.setStyle(this.style);
    },
    /**
     * Sets the value of the field. Validates as well, and clears shown input if invalid.
     */
    setValue: function (value) {
      // argh! 0 is falsey in javascript, but it's valid for us
      this.numberObject = value || value === 0 ? Number(value) : null;
      this.$.numberField.setValue(Globalize.format(this.numberObject, "n"));
    },
    /**
     * Returns the number value and not the string
     */
    getNumberObject: function () {
      return isFinite(this.numberObject) ? this.numberObject : null;
    },
    getValue: function () {
      return this.getNumberObject();
    },
    doFieldChanged: function (inSender, inEvent) {
      this.setValue(inSender.getValue());
    }
  });
}());
