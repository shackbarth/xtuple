/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, XV:true, XM:true, Backbone:true, enyo:true, _:true */
(function () {
  //"use strict";

  enyo.kind({
    name: "XV.AddressWidget",
    kind: enyo.Control,
    published: {
      model: null
    },
    events: {
      onFieldChanged: ""
    },
    components: [
      { kind: "onyx.Input" }
    ],
    /**
     * A convenience function so that this object can be treated generally like an input
     */
    setValue: function (object) {
      this.setModel(object);
    },
    /**
     * A convenience function so that this object can be treated generally like an input
     */
    getValue: function () {
      return this.getModel();
    },
    /**
     * render this object onto the name field
     */
    modelChanged: function () {
      /**
       * Populate the input with the applicable field. If there's no model chosen
       * just leave the field blank.
       */
      var displayValue = this.getModel() ? this.getModel().get(this.getTitleField()) : "";
      this.$.nameField.setValue(displayValue);
    },
  });
}());
