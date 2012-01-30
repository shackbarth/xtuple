
/*globals XT */

sc_require("mixins/logging");

/** @class

  @todo REVIEW ME REVIEW ME THIS WAS TAKEN FROM PROTOTYPE!!!

*/
XT.Store = SC.Store.extend(XT.Logging,
  /** @scope XT.Store.prototype */ {

  start: function() {
    this.log("Starting up");
    return YES;
  },

  name: "XT.Store"

});

XT.set('store', XT.Store.create().from('XT.DataSource'));