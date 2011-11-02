
/*globals XT */

/** @namespace

  @extends SC.Object
*/
XT.PluginManager = XT.Object.create(
  /** @scope XT.PluginManager.prototype */ {
  
  start: function() {
    this.log("Starting up");
    this._plugins = SC.clone(SC.MODULE_INFO);
    return YES;
  },

  fetch: function(plugin) {
    var path = this.pluginPath(plugin),
        self = this;
    if(!this._plugins[path]) {
      this.warn("Could not find requested plugin %@".fmt(plugin));
      return NO;
    }
    this.load(path, function() { self._run(); });
  },

  pluginPath: function(plugin) {
    return "xt/%@".fmt(plugin.toLowerCase());
  },

  didLoad: function(plugin) {
    if(!plugin) return;
    this.log("Plugin %@ was loaded".fmt(plugin.name));
    if(
      plugin.didLoad
      && SC.typeOf(plugin.didLoad) === SC.T_FUNCTION
      && plugin.get("isLoaded") !== YES)
        this.queue(function() { plugin.didLoad(); });
    else this.warn("No didLoad function available on plugin");
  },

  load: function(target, callback) {
    return SC.Module.loadModule(target, callback); 
  },

  queue: function(method) {
    if(SC.typeOf(method) === SC.T_FUNCTION)
      this._queue.push(method);
    else this.warn("Could not queue non-function");
  },

  _run: function() {
    var q = this._queue;
    while(q.length > 0) {
      var m = q.pop();
      if(SC.typeOf(m) === SC.T_FUNCTION)
        m();
    }
  },

  _queue: [],
}) ;
