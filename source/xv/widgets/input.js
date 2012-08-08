/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {

  enyo.kind({
    name: "XV.Input",
    published: {
      value: null,
      disabled: false
    },
    events: {
      "onValueChange": ""
    },
    components: [
      {name: "input", kind: "onyx.Input", onchange: "inputChanged"}
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
    }
  });
  
  enyo.kind({
    name: "XV.InputWidget",
    kind: "XV.Input",
    classes: "xv-inputwidget",
    published: {
      label: ""
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
    },
    labelChanged: function () {
      var label = (this.getLabel() || ("_" + this.name).loc());
      this.$.label.setContent(label + ":");
      this.$.input.setPlaceholder(label);
    }
  });
  
}());
