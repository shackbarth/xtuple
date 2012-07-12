/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, enyo:true, _:true */
(function () {
  //"use strict";


  // TODO: validate input and complain if invalid

  enyo.kind({
    name: "NumberWidget",
    kind: "onyx.Input",
    numberObject: null,
    /**
     * Sets the value of the field. Validates as well, and clears shown input if invalid.
     */
    setValue: function (value) {
      this.inherited(arguments);
      this.numberObject = value ? Number(value) : null;
    },
    /**
     * Returns the number value and not the string
     */
    getValue: function () {
      return isFinite(this.numberObject) ? this.numberObject : null;
    }
  });
}());
