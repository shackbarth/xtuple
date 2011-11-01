
/*globals XT */

sc_require("mixins/logging");

/** @class



*/
XT.Store = SC.Store.extend(XT.Logging,
  /** @scope XT.Store.prototype */ {

  start: function() {
    this.log("Starting up");
    return YES;
  }

}) ;
