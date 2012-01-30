/*globals Dashboard */

sc_require("pages/default");

/** @namespace

*/
Dashboard = Plugin.Dashboard = Plugin.Object.create(
  /** @scope Plugin.Dashboard.prototype */ {

  pluginName: "Dashboard",

  pluginIndex: 1,

  page: Plugin.pages.dashboard,

  defaultView: Plugin.DEFAULT_VIEW

}) ;
