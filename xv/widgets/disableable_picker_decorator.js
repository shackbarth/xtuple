/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, enyo:true, _:true */
(function () {
  "use strict";

  enyo.kind({
    name: "XV.DisableablePickerDecorator",
    kind: "onyx.PickerDecorator",
    published: {
      disabled: false
    },
	change: function (inSender, inEvent) {
      if (!disabled) {
        this.waterfallDown("onChange", inEvent);
      }
    }
  });
}());
