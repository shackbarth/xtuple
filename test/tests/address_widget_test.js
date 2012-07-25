/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, Backbone:true, enyo:true, XT:true */

(function () {
  "use strict";

  enyo.kind({
    name: "XT.AddressWidgetTest",
    kind: "enyo.TestSuite",
    components: [
      { kind: "XV.AddressWidget", name: "addressWidget" }
    ],
    getObj: function () {
      return this.$.addressWidget;
    },
    beforeEach: function () {
      var m = new XM.Address();
      m.fetch({ id: 37 }); // TODO: we need a database we can trust to not change
      this.getObj().setModel(m);
    },
    testParseCity: function () {
      //this.getObj().setValue("XYZ");
      //var err = this.getObj().getValue() === undefined ? "" : "Widget not rendering junk as undefined";
      var err = this.assertEquals("Norfolk, VA 23180", this.getObj().getCity());
      this.finish(err);
    },
    assertEquals: function (expected, actual) {
      if (expected === actual) {
        return "";
      } else {
        return "Expected " + expected + ". Saw " + actual;
      }
    }
  });
}());
