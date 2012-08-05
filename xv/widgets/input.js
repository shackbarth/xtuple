/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {

  enyo.kind({
    name: "XV.Input",
    published: {
      value: null
    },
    events: {
      "onValueChange": ""
    },
    components: [
      {name: "input", kind: "onyx.Input", onchange: "inputChanged"}
    ],
    inputChanged: function (inSender, inEvent) {
      if (this._ignoreChange) { return; }
      var value = this.$.input.getValue();
      this.setValue(value);
    },
    setDisabled: function (value) {
      this.$.input.setDisabled(value);
    },
    setValue: function (value, options) {
      options = options || {};
      var oldValue = this.getValue(),
        inEvent;
      if (oldValue !== value) {
        this.value = value;
        this.valueChanged(value);
        inEvent = { value: value, originator: this };
        if (!options.silent) {
          this.doValueChange(inEvent);
        }
      }
    },
    valueChanged: function (value) {
      this._ignoreChange = true;
      this.$.input.setValue(value);
      this._ignoreChange = false;
    }
  });
  
  enyo.kind({
    name: "XV.InputWidget",
    kind: "XV.Input",
    components: [
      {kind: "onyx.InputDecorator", components: [
        {name: "input", kind: "onyx.Input", onchange: "inputChanged"}
      ]}
    ]
  });
  
}());
