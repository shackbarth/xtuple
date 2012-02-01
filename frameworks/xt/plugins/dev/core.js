
/*globals XT */

sc_require("plugins/dev/pages/default");

/** @namespace

  @extends XT.Plugin
*/
Dev = Plugin.Dev = Plugin.Object.create(
  /** @scope PLUGIN.Crm.prototype */ {
  
  pluginName: "Dev",
  
  pluginIndex: -1,

  page: Plugin.pages.dev,

  defaultView: Plugin.DEFAULT_VIEW

}) ;
