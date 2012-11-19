/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {

  /**
    @class Use to build the checkbox input field which goes inside a checkbox widget.
    @name XV.Checkbox
    @see XV.CheckboxWidget
   */
  enyo.kind(/** @lends XV.Checkbox# */{
    name: "XV.Checkbox",
    kind: "onyx.Checkbox",
    published: {
      attr: null
    },
    events: {
      onValueChange: ""
    },
    handlers: {
      onchange: "changed"
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
    @class Use to build a checkbox widget which holds a checkbox and its label.
    @name XV.CheckboxWidget
    @see XV.Checkbox
   */
  enyo.kind(/** @lends XV.CheckboxWidget# */{
    name: "XV.CheckboxWidget",
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
          {name: "input", kind: "onyx.Checkbox", onchange: "inputChanged"}
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
    @todo Document the valueChanged method.
    */
    valueChanged: function (value) {
      this.$.input.setValue(value);
      return value;
    }
  });

}());
