/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {

  enyo.kind({
    name: "XV.NumberWidget",
    published: {
      value: null,
      scale: 2
    },
    events: {
      "onValueChange": ""
    },
    components: [
      {kind: "onyx.InputDecorator", components: [
        {name: "input", kind: "onyx.Input", onchange: "inputChanged"}
      ]}
    ],
    inputChanged: function (inSender, inEvent) {
      if (this._ignoreChange) { return; }
      var value = Number(this.$.input.getValue());
      if (isNaN(value)) {
        this._setInput(this.getValue());
      } else {
        this.setValue(value);
      }
    },
    setValue: function (value, options) {
      options = options || {};
      var oldValue = this.getValue(),
        newValue = _.isNumber(value) ? value : null,
        inEvent;
      if (oldValue !== newValue) {
        this.value = value;
        this._setInput(value);
        inEvent = { value: value, originator: this };
        if (!options.silent) { this.doValueChange(inEvent); }
      }
    },
    /** @private */
    _setInput: function (value) {
      var scale = this.getScale(),
        inputValue = value ? Globalize.format(value, "n" + scale) : "";
      this._ignoreChange = true;
      this.$.input.setValue(inputValue);
      this._ignoreChange = false;
    }
  });

}());
