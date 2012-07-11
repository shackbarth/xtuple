/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, enyo:true, _:true */
(function () {
  "use strict";

  enyo.kind({
    name: "NumberWidget",
    kind: "enyo.Control",
    published: {
      numberObject: null
    },
    //components: [{
    //  kind: "onyx.InputDecorator",
      components: [
        { kind: "onyx.Input", name: "numberField", placeholder: "Enter number", onchange: "doInputChanged" }
    //  ]
    ],
    /**
     * A convenience function so that this object can be treated generally like an input
     */
    setValue: function (number) {
      this.setNumberObject(number);
    },
    /**
     * A convenience function so that this object can be treated generally like an input
     */
    getValue: function () {
      return this.getNumberObject();
    },
    numberObjectChanged: function () {
      this.$.numberField.setValue(this.numberObject.toLocaleString());
    },
    doInputChanged: function () {
      // lucky: no infinite loop! This function only gets triggered from an
      // actual user input, and not if the field is changed via the numberObjectChanged
      // function
      this.setNumberObject(Number(this.$.numberField.getValue()));
    }
  });
}());
