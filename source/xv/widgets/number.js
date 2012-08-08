/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, Globalize:true, enyo:true, _:true */

(function () {

  enyo.kind({
    name: "XV.Number",
    kind: "XV.Input",
    published: {
      scale: 0
    },
    setValue: function (value, options) {
      value = _.isNumber(value) ? XT.math.round(value, this.getScale()) : null;
      XV.Input.prototype.setValue.call(this, value, options);
    },
    validate: function (value) {
      value = Number(value);
      return isNaN(value) ? false : value;
    },
    valueChanged: function (value) {
      value = value ? Globalize.format(value, "n" + this.getScale()) : "";
      return XV.Input.prototype.valueChanged.call(this, value);
    }
  });
  
  enyo.kind({
    name: "XV.NumberWidget",
    kind: "XV.Number",
    classes: "xv-inputwidget xv-numberwidget",
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
      var label = (this.getLabel() || ("_" + this.name).loc()) + ":";
      this.$.label.setContent(label);
    }
  });

}());
