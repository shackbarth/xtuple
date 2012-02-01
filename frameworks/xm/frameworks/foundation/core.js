/*globals XM process global */

/* Node compatibility */
if (SC.ready === undefined) {
  SC.ready = function(callback) {
    process.nextTick(callback);
  };
}

/** @namespace
  
  @extends SC.Object
*/
XM = global.XM = SC.Object.create(
  /** @scope XM.prototype */ {

  NAMESPACE: "XM",
  VERSION: "4.0.0ALPHA"

});

