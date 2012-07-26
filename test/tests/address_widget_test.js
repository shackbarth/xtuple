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
      // FIXME: getting inexplicable Insufficient privileges to fetch error
      m.fetch({ id: 37 }); // TODO: we need a database we can trust to not change
      this.getObj().setModel(m);
    },
    // tests for this class are incomplete and in cryofreeze
    //testParseCity: function () {
      //var err = this.assertEquals("Norfolk, VA 23180", this.getObj().getValue().get("city"));
      //this.finish(err);
    //},
    assertEquals: function (expected, actual) {
      if (expected === actual) {
        return "";
      } else {
        return "Expected " + expected + ". Saw " + actual;
      }
    }
  });
}());
