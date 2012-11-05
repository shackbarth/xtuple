/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, Backbone:true, enyo:true, XT:true */

(function () {
  "use strict";

  enyo.kind({
    name: "XV.DropdownTest",
    kind: "enyo.TestSuite",
    components: [
      { kind: "XV.PickerWidget", name: "pickerWidget" }
    ],
    getObj: function () {
      return this.$.pickerWidget;
    },
    beforeEach: function () {
      this.getObj().$.picker.createComponent({kind: "onyx.MenuItem", value: {id: "O"}});
    },
    testRejectJunk: function () {
      this.getObj().setValue("XYZ");
      var err = this.getObj().getValue() === null ? "" : "Widget not rendering junk as null";
      this.finish(err);
    },
    testAcceptValid: function () {
      this.getObj().setValue("O");
      var err = this.getObj().getValue().id === "O" ? "" : "Widget not accepting valid input";
      this.finish(err);
    },
    testKeepOldValue: function () {
      this.getObj().setValue("O");
      this.getObj().setValue("XYZ");
      var err = this.getObj().getValue().id === "O" ? "" : "Widget not keeping valid input after junk input";
      this.finish(err);
    }
  });
}());
