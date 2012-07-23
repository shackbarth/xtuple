/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, 
trailing:true white:true*/
/*global XT:true, XM:true, enyo:true, Globalize:true*/

(function () {
  
  enyo.kind({
    name: "XV.Input",
    kind: "Input",
    classes: "xt-input"
  });

  enyo.kind({
    name: "XV.Button",
    kind: "Button",
    classes: "xt-button",
    events: {
      onButtonTapped: ""
    },
    handlers: {
      ontap: "buttonTapped"
    },
    buttonTapped: function () {
      this.doButtonTapped();
    }
  });

}());