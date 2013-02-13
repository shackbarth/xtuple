/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {

  /**
    @name XV.ToggleButton
    @class A control that looks like a switch with labels for two states.<br />
    Derived from <a href="http://enyojs.com/api/#onyx.ToggleButton">onyx.ToggleButton</a>.
    @extends onyx.ToggleButton
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
    /**
     @todo Document the clear method.
     */
    clear: function (options) {
      this.setValue(false, options);
    },
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
    }
  });

  /**
    @name XV.ToggleButtonWidget
    @class An input control consisting of fittable columns:
     label, decorator, and toggle button.<br />
    Use to implement a toggle button, a switch with labels for two states.<br />
    Creates an HTML input element.
    @extends XV.Input
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
    },
    /**
     @todo Document the inputChanged method.
     */
    inputChanged: function (inSender, inEvent) {
      var input = this.$.input.getValue();
      this.setValue(input);
    },
    /**
     @todo Document the labelChanged method.
     */
    labelChanged: function () {
      var label = (this.getLabel() || ("_" + this.attr || "").loc()) + ":";
      this.$.label.setContent(label);
    },
    /**
   Not applicable in the context of a toggle button,
   even though it is available to input widgets generally.
     */
    placeholderChanged: function () {
      // Not applicable
    },
    /**
     @todo Document the valueChanged method.
     */
    valueChanged: function (value) {
      this.$.input.setValue(value);
      return value;
    },
    typeChanged: function () {
      // Toggle button doesn't have this
    }
  });

}());
