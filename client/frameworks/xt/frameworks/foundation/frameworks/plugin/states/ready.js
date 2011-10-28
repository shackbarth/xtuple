
/*globals PLUGIN */

/** @class

*/
PLUGIN.READY = SC.State.extend(
  /** @scope PLUGIN.READY.prototype */ {

  enterState: function() {
    this.setPath("owner.isReady", YES);
  }
}) ;