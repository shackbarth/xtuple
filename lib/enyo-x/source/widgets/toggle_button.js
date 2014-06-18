/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {

  /**
    @name XV.ToggleButtonWidget
    @class An input control consisting of fittable columns:
     label, decorator, and toggle button.<br />
    Use to implement a toggle button, a switch with labels for two states.<br />
    Creates an HTML input element.
    @extends XV.Input
   */
  enyo.kind({
    name: "XV.ToggleButtonWidget",
    kind: "XV.InputWidget",
    classes: "xv-inputwidget xv-checkboxwidget",
    events: {
      onValueChange: ""
    },
    handlers: {
      onChange: "changed"
    },
    components: [
      {controlClasses: 'enyo-inline', components: [
        {name: "label", content: "", classes: "xv-label"},
        {kind: "onyx.InputDecorator", classes: "xv-input-decorator",
          components: [
          {name: "input", kind: "onyx.ToggleButton", onChange: "inputChanged"}
        ]}
      ]}
    ],
    /**
     @todo Document the setValue method.
     */
    setValue: function (value, options) {
      options = options || {};
      this._silent = options.silent;
      this.inherited(arguments);
      this._silent = false;
    },
    /**
     @todo Document the changed method.
     */
    changed: function (inSender, inEvent) {
      if (!this._silent) {
        inEvent.value = this.getValue();
        this.doValueChange(inEvent);
      }
    },
    /**
     @todo Document the clear method.
     */
    clear: function (options) {
      this.setValue(false, options);
    },
    /**
     @todo Document the create method.
     */
    create: function () {
      this.inherited(arguments);
      this.labelChanged();
      // this allows for value to be set on construction, silently
      var options = {silent: true};
      this.valueChanged(this.getValue(), options);
    },
    /**
     @todo Document the inputChanged method.
     */
    inputChanged: function (inSender, inEvent) {
      var input = this.$.input.getValue();
      this.setValue(input);
    },
    /**
     @todo Document the valueChanged method.
     */
    valueChanged: function (value, options) {
      this.$.input.setValue(value, options);
      return value;
    },
    typeChanged: function () {
      // Toggle button doesn't have this
    }
  });

}());
