/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, Backbone:true, enyo:true, XT:true */

(function () {
  "use strict";

  enyo.kind({
    name: "XV.DateTest",
    kind: "enyo.TestSuite",
    components: [
      { kind: "XV.DateWidget", name: "dateWidget" }
    ],
    getObj: function () {
      return this.$.dateWidget;
    },
    testCorrectCenturyFourDigit: function () {
      this.getObj().$.input.setValue("2/4/1808");
      var err = this.getObj().getValue().getFullYear() === 1808 ? "" : "Four-digit years should be taken at face value";
      this.finish(err);
    },
    /*testCorrectCenturyTwoDigit: function () {
      this.getObj().setValue("2/4/08");
      var err = this.getObj().getValue().getFullYear() === 2008 ? "" : "Two-digit years should be assumed to be in the 2000's";
      this.finish(err);
    },
    // this one is good to run with the browser in different time zones
    testMeWithDifferentTimeZonesPlease: function () {
      this.getObj().setValue("#5");
      var err = this.getObj().getValue().getFullYear() === 2008 ? "" : "Two-digit years should be assumed to be in the 2000's";
      this.finish(err);
    }
    */
  });
}());
