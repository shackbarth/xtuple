/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, XV:true, XM:true, Backbone:true, enyo:true, _:true */
(function () {
  //"use strict";

  enyo.kind({
    name: "XV.Address",
    kind: enyo.Control,
    published: {
      model: null
    },
    events: {
      onModelUpdate: ""
    },
    components: [
      // XXX fields are disabled until we get this whole thing to work
      { kind: "onyx.Input", name: "line1Field", onchange: "doAddress1Changed" },
      { kind: "onyx.Input", name: "line2Field", onchange: "doAddress2Changed" },
      { kind: "onyx.Input", name: "line3Field", onchange: "doAddress3Changed" },
      { kind: "onyx.Input", name: "cityField", onchange: "doCityChanged" }
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
    formatCity: function (city, state, zip) {
      return city + ", " + state + " " + zip;
    },
    // XXX if we want to keep this sort of implementation we should move this function to a static area
    // http://stackoverflow.com/questions/5097875/help-parsing-string-city-state-zip-with-javascript
    parseAddress: function (a) {
      if (typeof a!=="string") throw "Address is not a string.";a=a.trim();var r={},c=a.indexOf(',');r.city=a.slice(0,c);var f=a.substring(c+2),s=f.lastIndexOf(' ');r.state=f.slice(0,s);r.zip=f.substring(s+1);return r;
    },

    /**
     * render this object onto the name field
     * XXX the problem is we're receiving an AddressInfo object and we probably want an Address object
     */
    modelChanged: function () {
      /**
       * Populate the input with the applicable field. If there's no model chosen
       * just leave the field blank.
       */
      this.$.line1Field.setValue(this.getModel() ? this.getModel().get("line1") : "");
      this.$.line2Field.setValue(this.getModel() ? this.getModel().get("line2") : "");
      this.$.line3Field.setValue(this.getModel() ? this.getModel().get("line3") : "");
      this.$.cityField.setValue(this.getModel() ? this.formatCity(
        this.getModel().get("city"),
        this.getModel().get("state"),
        this.getModel().get("postalCode")
      ) : "");
    },
    doAddress1Changed: function (inSender, inEvent) {
      this.getModel().set({ line1: inSender.getValue() });
    },
    doAddress2Changed: function (inSender, inEvent) {
      this.getModel().set({ line2: inSender.getValue() });
    },
    doAddress3Changed: function (inSender, inEvent) {
      this.getModel().set({ line3: inSender.getValue() });
    },
    // TODO use fuzzy logic match
    doCityChanged: function (inSender, inEvent) {
      var parsed = this.parseAddress(inSender.getValue());
      this.getModel().set({ city: parsed.city, state: parsed.state, postalCode: parsed.zip });
      this.doModelUpdate();
    },
  });
}());
