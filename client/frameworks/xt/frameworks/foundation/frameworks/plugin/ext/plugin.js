
/*globals XT */

/** @class

  @extends SC.Object
*/
XT.Plugin = XT.Object.extend(SC.StatechartManager,
  /** @scope XT.Plugin.prototype */ {
  
  init: function() {
    XT.PluginManager.didLoad(this);
  }

}) ;
