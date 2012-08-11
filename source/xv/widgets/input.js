/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {

  enyo.kind({
    name: "XV.Input",
    classes: "xv-input",
    published: {
      value: null,
      disabled: false
    },
    events: {
      "onValueChange": ""
    },
    components: [
      // XXX subinput?! really we just make sure this subinput reflects css such as width in its container
      {name: "input", kind: "onyx.Input", classes: "xv-subinput", onchange: "inputChanged"}
    ],
    clear: function (options) {
      this.setValue("", options);
    },
    create: function () {
      this.inherited(arguments);
      this.disabledChanged();
    },
    disabledChanged: function () {
      this.$.input.setDisabled(this.getDisabled());
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

  enyo.kind({
    name: "XV.InputWidget",
    kind: "XV.Input",
    classes: "xv-inputwidget",
    published: {
      label: "",
      placeholder: ""
    },
    components: [
      {kind: "onyx.InputDecorator", classes: "xv-input-decorator",
        components: [
        {name: "label", content: "", classes: "xv-label"},
        {name: "input", kind: "onyx.Input", onchange: "inputChanged"}
      ]}
    ],
    create: function () {
      this.inherited(arguments);
      this.labelChanged();
      this.placeholderChanged();
    },
    labelChanged: function () {
      var label = (this.getLabel() || ("_" + this.name).loc());
      this.$.label.setContent(label + ":");
    },
    placeholderChanged: function () {
      var placeholder = this.getPlaceholder();
      this.$.input.setPlaceholder(placeholder);
    }
  });

}());
