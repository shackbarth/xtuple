/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, Backbone:true, enyo:true, XT:true */

(function () {
  "use strict";

  enyo.kind({
    name: "XV.NumberTest",
    kind: "enyo.TestSuite",
    components: [
      { kind: "XV.NumberWidget", name: "numberWidget" }
    ],
    getObj: function () {
      return this.$.numberWidget;
    },
    testGetValueIsNumberFromString: function () {
      this.getObj().setValue("10");
      this.finish(XV.applyTest('number', typeof this.getObj().getValue(), "Number widget should accept strings that look like numbers"));
    },
    testAcceptDecimal: function () {
      var numberWidget = this.getObj();
      numberWidget.setScale(1);
      numberWidget.setValue(4.6);
      this.finish(XV.applyTest(4.6, this.getObj().getValue(), "Widget not dealing with decimals"));
    },
    testRoundToScale: function () {
      this.getObj().setValue(4.6);
      this.finish(XV.applyTest(5, this.getObj().getValue(), "Widget not rounding decimals beyond scale"));
    },
    testEmptyStringAsNull: function () {
      this.getObj().setValue('');
      this.finish(XV.applyTest(null, this.getObj().getValue(), "Empty string input not being set to null"));
    },
    testNullAsNull: function () {
      this.getObj().setValue(null);
      this.finish(XV.applyTest(null, this.getObj().getValue(), "Null input not being set to null"));
    },
    testJunkAsNull: function () {
      this.getObj().setValue("invalid_junk");
      this.finish(XV.applyTest(null, this.getObj().getValue(), "Junk input not being set to null"));
    },
    testZero: function () {
      this.getObj().setValue(0);
      this.finish(XV.applyTest(0, this.getObj().getValue(), "Widget not handling input of zero"));
    }
  });
}());
