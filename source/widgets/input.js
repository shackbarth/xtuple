/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {

  /**
    An input field that maintains a consistent API to be used by workspaces.

    @class
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
      placeholder: null
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
    clear: function (options) {
      this.setValue("", options);
    },
    create: function () {
      this.inherited(arguments);
      this.placeholderChanged();
      this.disabledChanged();
    },
    disabledChanged: function () {
      this.$.input.setDisabled(this.getDisabled());
    },
    focus: function () {
      this.$.input.focus();
    },
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
    keyDown: function (inSender, inEvent) {
      // XXX hack here (and in other places that reference issue 18397)
      // can be removed once enyo fixes ENYO-1104
      var shadowNone = inEvent.originator.hasClass("text-shadow-none");
      inEvent.originator.addRemoveClass("text-shadow-none", !shadowNone);
      inEvent.originator.addRemoveClass("text-shadow-0", shadowNone);
      // end hack
    },
    placeholderChanged: function () {
      var placeholder = this.getPlaceholder();
      this.$.input.setPlaceholder(placeholder);
    },
    receiveBlur: function () {
      // Because webkit browsers don't always emit a change event
      if (this.$.input.getValue() !== this.getValue()) {
        this.inputChanged();
      }
    },
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
    validate: function (value) {
      return value;
    },
    valueChanged: function (value) {
      this.$.input.setValue(value || "");
      return value;
    },
    setInputStyle: function (style) {
      this.$.input.setStyle(style);
    },
    setDisabled: function (isDisabled) {
      this.$.input.setDisabled(isDisabled);
    }
  });

  /**
    An input with styled label and decorator that maintains a consistent API
    for use in a workspace.

    @class
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
    create: function () {
      this.inherited(arguments);
      this.labelChanged();
      this.placeholderChanged();
      this.showLabelChanged();
    },
    labelChanged: function () {
      var label = (this.getLabel() || ("_" + this.attr || "").loc());
      this.$.label.setContent(label + ":");
    },
    keyDown: function (inSender, inEvent) {
      // XXX hack here (and in other places that reference issue 18397)
      // can be removed once enyo fixes ENYO-1104
      var shadowNone = inEvent.originator.hasClass("text-shadow-none");
      inEvent.originator.addRemoveClass("text-shadow-none", !shadowNone);
      inEvent.originator.addRemoveClass("text-shadow-0", shadowNone);
      // end hack
    },
    showLabelChanged: function () {
      if (this.getShowLabel()) {
        this.$.label.show();
      } else {
        this.$.label.hide();
      }
    }
  });

}());
