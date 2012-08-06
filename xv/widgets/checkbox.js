/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {
 
  enyo.kind({
    name: "XV.Checkbox",
    kind: "onyx.Checkbox",
    events: {
      onValueChange: ""
    },
    handlers: {
      onchange: "changed"
    },
    setValue: function (value, options) {
      options = options || {};
      this._silent = options.silent;
      this.inherited(arguments);
      this._silent = false;
    },
    changed: function (inSender, inEvent) {
      if (!this._silent) {
        inEvent.value = this.getValue();
        this.doValueChange(inEvent);
      }
    }
  });
  
  enyo.kind({
    name: "XV.CheckboxWidget",
    kind: "XV.Input",
    classes: "xv-inputwidget xv-checkboxwidget",
    published: {
      label: ""
    },
    components: [
      {kind: "onyx.InputDecorator", classes: "xv-inputwidget-decorator",
        components: [
        {name: "label", content: "", classes: "xv-label"},
        {name: "input", kind: "onyx.Checkbox", onchange: "inputChanged"}
      ]}
    ],
    create: function () {
      this.inherited(arguments);
      this.labelChanged();
    },
    labelChanged: function () {
      var label = (this.getLabel() || ("_" + this.name).loc()) + ":";
      this.$.label.setContent(label);
    }
  });
  
}());
