/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {

  /**
    @class An input field that maintains a consistent API to be used by workspaces.
    @name XV.Input
    @see XV.InputWidget
   */
  enyo.kind(/** @lends XV.Input# */{
    name: "XV.Input",
    classes: "xv-input",
    published: {
      attr: null,
      value: null,
      disabled: false,
      placeholder: null,
      type: null
    },
    events: {
      "onValueChange": ""
    },
    handlers: {
      onblur: "receiveBlur"
    },
    components: [
      {name: "input", kind: "onyx.Input", classes: "xv-subinput", onchange: "inputChanged", onkeydown: "keyDown"}
    ],
    /**
    @todo Document the clear method.
    */
    clear: function (options) {
      this.setValue("", options);
    },
    /**
    @todo Document the create method.
    */
    create: function () {
      this.inherited(arguments);
      this.placeholderChanged();
      this.disabledChanged();
      this.typeChanged();
    },
    /**
     The disabledChanged method, and many below it, are here to deal with the fact that XV.Input does
     not inherit from onyx.input or enyo.input, and so insofar as it needs to support their APIs, we
     have to redeclare the methods and pass through the data.
    */
    disabledChanged: function () {
      this.$.input.setDisabled(this.getDisabled());
    },
    /**
    @todo Document the focus method.
    */
    focus: function () {
      this.$.input.focus();
    },
    /**
    @todo Document the inputChanged method.
    */
    inputChanged: function (inSender, inEvent) {
      var input = this.$.input.getValue(),
        value = this.validate(input);
      if (value !== false) {
        this.setValue(value);
      } else {
        this.setValue(null);
        this.valueChanged("");
      }
    },
    /**
    @todo Revisit/remove after fix to ENYO-1104. See also issue 18397.
    */
    keyDown: function (inSender, inEvent) {
      // XXX hack here (and in other places that reference issue 18397)
      // can be removed once enyo fixes ENYO-1104
      var shadowNone = inEvent.originator.hasClass("text-shadow-none");
      inEvent.originator.addRemoveClass("text-shadow-none", !shadowNone);
      inEvent.originator.addRemoveClass("text-shadow-0", shadowNone);
      // end hack
    },
    /**
    @todo Document the placeholderChanged method.
    */
    placeholderChanged: function () {
      var placeholder = this.getPlaceholder();
      this.$.input.setPlaceholder(placeholder);
    },
    /**
    @todo Document the receiveBlur method.
    */
    receiveBlur: function () {
      // Because webkit browsers don't always emit a change event
      if (this.$.input.getValue() !== this.getValue()) {
        this.inputChanged();
      }
    },
    /**
    @todo Document the setValue method.
    */
    setValue: function (value, options) {
      options = options || {};
      var oldValue = this.getValue(),
        inEvent;
      if (oldValue !== value) {
        this.value = value;
        this.valueChanged(value);
        inEvent = { value: value, originator: this };
        if (!options.silent) { this.doValueChange(inEvent); }
      }
    },
    /**
    @todo Document the validate method.
    */
    validate: function (value) {
      return value;
    },
    /**
    @todo Document the valueChanged method.
    */
    valueChanged: function (value) {
      this.$.input.setValue(value || "");
      return value;
    },
    /**
      Pass through attributes intended for onyx input inside.
      XXX is this necessary given disabledChanged function above?
    */
    setDisabled: function (isDisabled) {
      this.$.input.setDisabled(isDisabled);
    },
    /**
      Pass through attributes intended for onyx input inside.
    */
    setInputStyle: function (style) {
      this.$.input.setStyle(style);
    },
    /**
      Pass through attributes intended for onyx input inside.
    */
    typeChanged: function () {
      this.$.input.setType(this.getType());
    }
  });

  /**
    @class An input with styled label and decorator that maintains a consistent API
    for use in a workspace.
    @name XV.InputWidget
    @extends @XV.Input
   */
  enyo.kind(/** @lends XV.InputWidget# */{
    name: "XV.InputWidget",
    kind: "XV.Input",
    classes: "xv-inputwidget",
    published: {
      label: "",
      showLabel: true
    },
    components: [
      {kind: "FittableColumns", components: [
        {name: "label", content: "", classes: "xv-label"},
        {kind: "onyx.InputDecorator", fit: true, classes: "xv-input-decorator",
          components: [
          {name: "input", kind: "onyx.Input", classes: "xv-subinput", onchange: "inputChanged", onkeydown: "keyDown"}
        ]}
      ]}
    ],
    /**
    @todo Document the create method.
    */
    create: function () {
      this.inherited(arguments);
      this.labelChanged();
      this.placeholderChanged();
      this.showLabelChanged();
    },
    /**
    @todo Document the labelChanged method.
    */
    labelChanged: function () {
      var label = (this.getLabel() || ("_" + this.attr || "").loc());
      this.$.label.setContent(label + ":");
    },
    /**
    @todo Document the keyDown method.
    */
    keyDown: function (inSender, inEvent) {
      // XXX hack here (and in other places that reference issue 18397)
      // can be removed once enyo fixes ENYO-1104
      var shadowNone = inEvent.originator.hasClass("text-shadow-none");
      inEvent.originator.addRemoveClass("text-shadow-none", !shadowNone);
      inEvent.originator.addRemoveClass("text-shadow-0", shadowNone);
      // end hack
    },
    /**
    @todo Document the showLabelChanged method.
    */
    showLabelChanged: function () {
      if (this.getShowLabel()) {
        this.$.label.show();
      } else {
        this.$.label.hide();
      }
    }
  });

}());
