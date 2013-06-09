/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {

  /**
    @name XV.Input
    @class Maintains a consistent API to be used by workspaces.<br />
    The superkind from which other xTuple input objects are derived.<br />
    To create an input field for strings, see {@link XV.InputWidget}.<br />
    To create an input field for dates, see {@link XV.DateWidget}.<br />
    To create an input field for files, see {@link XV.FileInput}.<br />
    To create an input field for numbers, see {@link XV.NumberWidget}.<br />
    To create a multi-line textarea input box, see {@link XV.TextArea}.<br />
    To create a checkbox, see {@link XV.CheckboxWidget}.<br />
    To create a togglebutton, see {@link XV.TogglebuttonWidget}.<br />
   */
  enyo.kind(/** @lends XV.Input# */{
    name: "XV.Input",
    classes: "xv-input",
    published: {
      attr: null,
      value: null,
      disabled: false,
      placeholder: null,
      type: null,
      maxlength: null
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
      this.maxlengthChanged();
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
      Called when the user changes the input. Validates field.
      If valid, calls setValue, which bubbles the event. Otherwise
      we bubble ourselves the empty string.
    */
    inputChanged: function (inSender, inEvent) {
      var input = this.$.input.getValue(),
        value = this.validate(input);
      if (value !== false) {
        // is valid and not empty
        this.setValue(value);
      } else {
        // is invalid or empty
        this.setValue(null);
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
      If the value has changed, update the user field using valueChanged,
      and bubble up the event so that the model may be updated (unless
      silent is true, which is how the workspace invokes it). This
      function nicely handles being told what to do both from below, by
      the user, or from above, by the workspace. The event
      that it bubbles up is valueChange, whereas the event that probably
      triggered it is inputChange.
    */
    setValue: function (value, options) {
      options = options || {};
      var oldValue = this.getValue(),
        inEvent;
      if (oldValue !== value) {
        this.value = value;
        this.valueChanged(value);
        if (!options.silent) {
          inEvent = { value: value, originator: this };
          // this bubbles up the onValueChange event which then
          // triggers the controlValueChanged in the workspace
          this.doValueChange(inEvent);
        }
      }
    },
    /**
      Returns the value if it's valid, or false if it's not
    */
    validate: function (value) {
      return value;
    },
    /**
      Updates the field that the user sees based on the published field.
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
    },

    maxlengthChanged: function () {
      this.$.input.setAttribute("maxlength", this.maxlength);
    }
  });

  /**
    @name XV.InputWidget
    @class An input control consisting of fittable columns:
      a styled label and an onyx.Input placed inside an onyx.InputDecorator,
      which provides styling.<br />
    Any controls in the InputDecorator appear to be inside an area styled as an input.<br />
    Use to implement a styled input field for strings.<br />
    Creates an HTML input element.
    @extends XV.Input
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