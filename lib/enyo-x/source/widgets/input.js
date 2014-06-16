/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, Globalize:true, enyo:true, _:true */

(function () {

  /**
    @name XV.InputWidget
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
  enyo.kind(
    /** @lends XV.InputWidget# */{
    name: "XV.InputWidget",
    classes: "xv-input",
    published: {
      attr: null,
      value: null,
      disabled: false,
      placeholder: null,
      type: null,
      maxlength: null,
      label: "",
      showLabel: true
    },
    events: {
      "onValueChange": ""
    },
    handlers: {
      onblur: "receiveBlur"
    },
    components: [
      {controlClasses: 'enyo-inline', components: [
        {name: "label", classes: "xv-label"},
        {kind: "onyx.InputDecorator", components: [
          {name: "input", kind: "onyx.Input", onchange: "inputChanged", onkeydown: "keyDown"}
        ]}
      ]}
    ],
    create: function () {
      this.inherited(arguments);
      this.placeholderChanged();
      this.disabledChanged();
      this.typeChanged();
      this.maxlengthChanged();
      this.labelChanged();
      this.showLabelChanged();
    },
    /**
      Sets the value of the input to an empty string
    */
    clear: function (options) {
      this.setValue("", options);
    },
    /**
     The disabledChanged method, and many below it, are here to deal with
     the fact that XV.Input does not inherit from onyx.input or enyo.input,
     and so insofar as it needs to support their APIs, we
     have to redeclare the methods and pass through the data.
    */
    disabledChanged: function () {
      this.$.input.setDisabled(this.getDisabled());
      this.$.label.addRemoveClass("disabled", this.getDisabled());
    },
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
      "text-shadow-none" hack here to fix issue #18397
      @todo Revisit/remove after fix to ENYO-1104. See also issue 18397.

      Added some handling here to force the input to save the value when
      the user uses the arrows or tab key.
    */
    keyDown: function (inSender, inEvent) {
      var shadowNone = inEvent.originator.hasClass("text-shadow-none"),
        keyCode = inEvent.keyCode;

      inEvent.originator.addRemoveClass("text-shadow-none", !shadowNone);
      inEvent.originator.addRemoveClass("text-shadow-0", shadowNone);

      // this adds support for tabbing and arrowing through grids
      if (keyCode === XV.KEY_TAB || keyCode === XV.KEY_DOWN || keyCode === XV.KEY_UP) {
        this.receiveBlur();
      }
    },
    /**
      Sets the placeholder on the input field.
    */
    placeholderChanged: function () {
      if (_.isFunction(this.$.input.setPlaceholder)) {
        this.$.input.setPlaceholder(this.placeholder);
      }
    },
    /**
      Webkit browsers do not always emit the proper change event,
      so this ensures that the changed value is saved.
    */
    receiveBlur: function () {
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
      Sets the type attribute for input field.
    */
    typeChanged: function () {
      this.$.input.setType(this.getType());
    },

    /**
      Set the maxlength attribute on the input field.
    */
    maxlengthChanged: function () {
      this.$.input.setAttribute("maxlength", this.maxlength);
    },

    /**
      Sets the label content based on the label value or the attribute text.
    */
    labelChanged: function () {
      var label = (this.getLabel() || ("_" + this.attr || "").loc());
      this.$.label.setContent(label + ":");
    },

    /**
      Sets visibility of the widget label.
    */
    showLabelChanged: function () {
      this.$.label.setShowing(this.getShowLabel());
    }
  });

}());
