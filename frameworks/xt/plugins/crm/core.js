
/*globals Crm */

sc_require("plugins/crm/pages/default");

/** @namespace

*/
Crm = Plugin.Crm = Plugin.Object.create(
  /** @scope Plugin.Crm.prototype */ {

  pluginName: "Crm",

  pluginIndex: 2,

  page: Plugin.pages.crm,

  defaultView: Plugin.DEFAULT_VIEW

}) ;
