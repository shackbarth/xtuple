/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {

  /**
    @name XV.CheckboxWidget
    @class An input control consisting of fittable columns:
      label, decorator, and checkbox.<br />
    Use to implement a styled checkbox
      which is made up of a checkbox input control and its label.
    @extends XV.Input
    @lends XV.CheckboxWidget
   */
  enyo.kind({
    name: "XV.CheckboxWidget",
    kind: "XV.InputWidget",
    classes: "xv-checkboxwidget",
    components: [
      {controlClasses: 'enyo-inline', components: [
        {name: "label", classes: "xv-label"},
        {kind: "onyx.InputDecorator", components: [
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

    inputChanged: function (inSender, inEvent) {
      var input = this.$.input.getValue();
      this.setValue(input);
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
    kind: "XV.CheckboxWidget",
    published: {
      label: "",
      disabled: false,
      checked: false
    },
    events: {
      onValueChange: ""
    },
    components: [
      {controlClasses: 'enyo-inline', components: [
        {name: "label", classes: "xv-label"},
        {kind: "onyx.InputDecorator", components: [
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
