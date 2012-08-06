/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, Backbone:true, enyo:true, XT:true */

(function () {
  "use strict";

  enyo.kind({
    name: "XT.DropdownWidgetTest",
    kind: "enyo.TestSuite",
    components: [
      { kind: "XV.DropdownWidget", name: "dropdownWidget" }
    ],
    getObj: function () {
      return this.$.dropdownWidget;
    },
    beforeEach: function () {
      this.getObj().setCollection("XM.projectStatuses");
    },
    testJunkAsUndefined: function () {
      this.getObj().setValue("XYZ");
      var err = this.getObj().getValue() === undefined ? "" : "Widget not rendering junk as undefined";
      this.finish(err);
    },
    testAcceptValid: function () {
      this.getObj().setValue("O");
      var err = this.getObj().getValue() === "O" ? "" : "Widget not accepting valid input";
      this.finish(err);
    },
    testKeepOldValue: function () {
      this.getObj().setValue("O");
      this.getObj().setValue("XYZ");
      var err = this.getObj().getValue() === "O" ? "" : "Widget not keeping valid input after junk input";
      this.finish(err);
    },
  });
}());
