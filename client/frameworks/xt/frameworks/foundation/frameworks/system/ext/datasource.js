
/*globals XT */

sc_require("mixins/logging");

/** @namespace

*/
XT.DataSource = SC.DataSource.extend(XT.Logging, 
  /** @scope XT.DataSource.prototype */ {

}) ;

XT.DataSource.start = function start() {
  XT.DataSource = XT.DataSource.create();
  XT.DataSource.log("Starting up");
  XT.DataSource.store = XT.Store = XT.Store.create().from(XT.DataSource);
  return YES;
} ;
