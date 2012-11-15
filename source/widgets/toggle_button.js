/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {

  /**
    @class Use to build the toggle button that goes inside the toggle button widget.
    @name XV.ToggleButton
    @see XV.ToggleButtonWidget
   */
  enyo.kind(/** @lends XV.ToggleButton# */{
    name: "XV.ToggleButton",
    kind: "onyx.ToggleButton",
    published: {
      attr: null
    },
    events: {
      onValueChange: ""
    },
    handlers: {
      onChange: "changed"
    },
    clear: function (options) {
      this.setValue(false, options);
    },
    setValue: function (value, options) {
      options = options || {};
      this._silent = options.silent;
      this.inherited(arguments);
      this._silent = false;
    },
    changed: function (inSender, inEvent) {
      if (!this._silent) {
        inEvent.value = this.getValue();
        this.doValueChange(inEvent);
      }
    }
  });

  /**
    @class Use to build a toggle button widget which hold a toggle button and its label.
    @name XV.ToggleButtonWidget
    @see XV.ToggleButton
   */
  enyo.kind(/** @lends XV.ToggleButtonWidget# */{
    name: "XV.ToggleButtonWidget",
    kind: "XV.Input",
    classes: "xv-inputwidget xv-checkboxwidget",
    published: {
      label: ""
    },
    components: [
      {kind: "FittableColumns", components: [
        {name: "label", content: "", classes: "xv-decorated-label"},
        {kind: "onyx.InputDecorator", classes: "xv-input-decorator",
          components: [
          {name: "input", kind: "onyx.ToggleButton", onChange: "inputChanged"}
        ]}
      ]}
    ],
    clear: function (options) {
      this.setValue(false, options);
    },
    create: function () {
      this.inherited(arguments);
      this.labelChanged();
    },
    inputChanged: function (inSender, inEvent) {
      var input = this.$.input.getValue();
      this.setValue(input);
    },
    labelChanged: function () {
      var label = (this.getLabel() || ("_" + this.attr || "").loc()) + ":";
      this.$.label.setContent(label);
    },
    placeholderChanged: function () {
      // Not applicable
    },
    valueChanged: function (value) {
      this.$.input.setValue(value);
      return value;
    }
  });

}());
