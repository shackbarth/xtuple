
/*globals XT */

/** @namespace

  @extends SC.Object
*/
XT.PluginManager = XT.Object.create(
  /** @scope XT.PluginManager.prototype */ {
  
  start: function() {
    this.log("Starting up");
    this._plugins = SC.clone(SC.MODULE_INFO);
    this.fetch("login");
    return YES;
  },

  fetch: function(plugin) {
    var path = this.pluginPath(plugin),
        self = this;
    if(!this._plugins[path]) {
      this.warn("Could not find requested plugin %@".fmt(plugin));
      return NO;
    }
    this.load(path);
  },

  pluginPath: function(plugin) {
    return "xt/%@".fmt(plugin.toLowerCase());
  },

  didLoad: function(plugin) {
    
  },

  load: function(target, callback) {
    return SC.Module.loadModule(target, callback); 
  }

}) ;
