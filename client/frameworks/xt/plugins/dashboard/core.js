/*globals Dashboard */

/** @namespace

*/
Dashboard = PLUGIN.Dashboard = XT.Plugin.create(
  /** @scope Dashboard.prototype */ {

  name: "Dashboard",

  didLoad: function() {
    sc_super();
    this.focus();
  }

}) ;
