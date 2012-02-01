/*globals XM */

sc_require("mixins/logging");

/** @class

  @todo REVIEW ME REVIEW ME THIS WAS TAKEN FROM PROTOTYPE!!!

*/
XM.Store = SC.Store.extend(XM.Logging,
  /** @scope XM.Store.prototype */ {

  start: function() {
    this.log("Starting up");
    return YES;
  },

  name: "XM.Store"

});

XM.set('store', XM.Store.create().from('XM.DataSource'));