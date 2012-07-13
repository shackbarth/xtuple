/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, enyo:true, _:true */
(function () {
  //"use strict";

  // XXX I'm not using this kind anymore. I thought it would be a solution
  // to the problem of capturing an "onchange" event, but doing it this way
  // throws a model update not just based on user input but also based on
  // the initialization of the screen.

  enyo.kind({
    name: "XV.Picker",
    kind: "onyx.Picker",
    events: {
      onModelUpdate: ""
    },

    selectedChanged: function (inOld) {
      this.inherited(arguments);
      this.doModelUpdate();
    }
  });
}());
