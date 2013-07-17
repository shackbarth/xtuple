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
      var mockModel = { id: "O", get: function (key) { return "O"; }};
      this.getObj().$.picker.createComponent({kind: "onyx.MenuItem", value: mockModel});
    },
    testRejectJunk: function () {
      this.getObj().setValue("XYZ");
      this.finish(XV.applyTest(null, this.getObj().getValue(), "Widget not rendering junk as null"));
    },
    testAcceptValid: function () {
      this.getObj().setValue("O");
      this.finish(XV.applyTest("O", this.getObj().getValue().id, "Widget not accepting valid input"));
    },
    testKeepOldValue: function () {
      this.getObj().setValue("O");
      this.getObj().setValue("XYZ");
      this.finish(XV.applyTest("O", this.getObj().getValue().id, "Widget not keeping valid input after junk input"));
    }
  });
}());
