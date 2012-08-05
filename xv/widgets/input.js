/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {

  enyo.kind({
    name: "XV.Input",
    kind: "onyx.Input",
    classes: "xt-input",
    events: {
      "onValueChange": ""
    },
    handlers: {
      "onchange": "inputChanged"
    },
    setValue: function (value, options) {
      options = options || {};
      if (options.silent) { this._silent = true; }
      this.inherited(arguments);
      this._silent = false;
    },
    inputChanged: function (inSender, inEvent) {
      inEvent.value = this.getValue();
      inEvent.originator = this;
      if (!this._silent) { this.doValueChange(inEvent); }
    }
  });

  enyo.kind({
    name: "XV.InputWidget",
    events: {
      "onValueChange": ""
    },
    components: [
      {kind: "onyx.InputDecorator", components: [
        {name: "input", kind: "onyx.Input", onchange: "inputChanged"}
      ]}
    ],
    getValue: function () {
      return this.$.input.getValue();
    },
    inputChanged: function (inSender, inEvent) {
      inEvent.value = this.getValue();
      inEvent.originator = this;
      this.doValueChange(inEvent);
    },
    setValue: function (value, options) {
      options = options || {};
      var inEvent;
      
      // Only notify if selection actually changed
      if (value !== this.getValue()) {
        this.$.input.setValue(value);
        if (!options.silent) {
          inEvent = { value: value, originator: this };
          this.doValueChange(inEvent);
        }
      }
    }
  });
  
}());
