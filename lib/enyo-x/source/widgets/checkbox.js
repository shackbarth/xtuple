/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {

  /**
    @name XV.Checkbox
    @class An input control that shows or hides a checkmark when clicked.</br >
    To implement a checkbox, see {@link XV.CheckboxWidget}.<br />
    Derived from <a href="http://enyojs.com/api/#onyx.Checkbox">onyx.Checkbox</a>.
    @extends onyx.Checkbox
   */
  enyo.kind(
    /** @lends XV.Checkbox# */{
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
    @name XV.CheckboxWidget
    @class An input control consisting of fittable columns:
      label, decorator, and checkbox.<br />
    Use to implement a styled checkbox
      which is made up of a checkbox input control and its label.
    @extends XV.Input
   */
  enyo.kind(/** @lends XV.CheckboxWidget# */{
    name: "XV.CheckboxWidget",
    kind: "XV.Input",
    classes: "xv-input xv-checkboxwidget",
    published: {
      label: ""
    },
    components: [
      {kind: "FittableColumns", components: [
        {name: "label", content: "", classes: "xv-label"},
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
    disabledChanged: function () {
      this.inherited(arguments);
      this.$.label.addRemoveClass("disabled", this.getDisabled());
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

  /**
    @name XV.StickyCheckboxWidget
    @class An input control consisting of fittable columns:
      label, decorator, and checkbox.<br />
    Use to implement a styled checkbox
      which is made up of a checkbox input control and its label.
      Remembers last checked setting using cookies. Not to be
      used with models.
    The object should be given a unique name as the name of the
    object will be used for the cookie name.
    @extends XV.Input
   */
  enyo.kind(/** @lends XV.StickyCheckboxWidget# */{
    name: "XV.StickyCheckboxWidget",
    classes: "xv-input xv-checkboxwidget",
    published: {
      label: "",
      disabled: false,
      checked: false
    },
    events: {
      onValueChange: ""
    },
    components: [
      {kind: "FittableColumns", components: [
        {name: "label", content: "", classes: "xv-label"},
        {kind: "onyx.InputDecorator", classes: "xv-input-decorator",
          components: [
          {name: "input", kind: "onyx.Checkbox", onchange: "inputChanged"}
        ]}
      ]}
    ],
    /**
    @todo Document the clear method.
    */
    clear: function () {
      this.$.input.setValue(false);
    },
    /**
    @todo Document the create method.
    */
    create: function () {
      var value,
        toBoolean = function (val) {
          if (_.isString(val)) {
            return val === "true" ? true : false;
          }
          return val;
        };

      this.inherited(arguments);
      this.labelChanged();
      if (this.name === "stickyCheckboxWidget") {
        this._err = true;
        throw "Sticky Checkbox Widget should have a unique name.";
      } else {
        value = toBoolean(enyo.getCookie(this.name));
        value = _.isBoolean(value) ? value : this.checked;
        this.checked = value;
        this.$.input.setValue(value);
      }
    },
    disabledChanged: function () {
      var disabled = this.getDisabled();
      this.$.input.setDisabled(disabled);
      this.$.label.addRemoveClass("disabled", disabled);
    },
    /**
    @todo Document the focus method.
    */
    focus: function () {
      this.$.input.focus();
    },
    inputChanged: function (inSender, inEvent) {
      this.setChecked(this.$.input.checked);
    },
    isChecked: function () {
      return this.$.input.checked;
    },
    /**
    @todo Document the labelChanged method.
    */
    labelChanged: function () {
      var label = (this.getLabel() || ("_" + this.attr || "").loc()) + ":";
      this.$.label.setContent(label);
    },
    checkedChanged: function () {
      this.$.input.setChecked(this.checked);
      if (!this._err) {
        enyo.setCookie(this.name, this.checked);
      }
      this.doValueChange({value: this.checked});
    }
  });

}());
