/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, Globalize:true, enyo:true, _:true */

(function () {

  enyo.kind({
    name: "XV.Number",
    kind: "XV.Input",
    published: {
      scale: 2
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
      XV.Input.prototype.valueChanged.call(this, value);
    }
  });
  
  enyo.kind({
    name: "XV.NumberWidget",
    kind: "XV.Number",
    components: [
      {kind: "onyx.InputDecorator", components: [
        {name: "input", kind: "onyx.Input", onchange: "inputChanged"}
      ]}
    ]
  });
  

}());
