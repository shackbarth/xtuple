
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

  route: function(to) {
    this.log("MY ROUTE METHOD WAS CALLED!");
    this.getPath("mainPage.defaultPane").append();
  },

  /** @property */
  isLoaded: NO

}) ;
