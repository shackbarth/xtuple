/*globals Dashboard */

/** @namespace

*/
Dashboard = PLUGIN.Dashboard = XT.Plugin.create(
  /** @scope Dashboard.prototype */ {

  didLoad: function() {
    sc_super();
    this.focus();
  }

}) ;
