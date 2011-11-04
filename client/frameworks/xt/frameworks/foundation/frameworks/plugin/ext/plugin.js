
/*globals XT */

/** @class

  @extends SC.Object
*/
XT.Plugin = XT.Object.extend(SC.StatechartManager,
  /** @scope XT.Plugin.prototype */ {
  
  init: function() {
    XT.PluginManager.didLoad(this);
  },

  /** @public */
  didLoad: function() {
    this.log("Default didLoad called");
    this.set("isLoaded", YES);
  },

  /** @public */
  focus: function() {
    XT.PluginController.focus(this);
  },

  /** @property */
  isLoaded: NO

}) ;
