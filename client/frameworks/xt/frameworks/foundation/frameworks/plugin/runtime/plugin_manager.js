
/*globals XT */

/** @namespace

  @extends SC.Object
*/


// FOR TESTING ONLY!
XT.SYSTEM_SET_PLUGINS = ["crm","accounting","sales"];
XT.SYSTEM_FIXED_PLUGINS = ["login"];


XT.PluginManager = XT.Object.create(
  /** @scope XT.PluginManager.prototype */ {
  
  start: function() {
    this.log("Starting up");
    this._plugins = SC.clone(SC.MODULE_INFO);
    this.fetch("login");
    return YES;
  },

  fetch: function(plugin, callback) {
    var path = this.pluginPath(plugin),
        self = this;
    if(!this._plugins[path]) {
      this.warn("Could not find requested plugin %@".fmt(plugin));
      return NO;
    }
    if(SC.typeOf(callback) === SC.T_FUNCTION)
      this.queue(callback);
    this._waitingFor = path;
    console.warn("SETTING WAITING FOR => ", this._waitingFor);
    this.load(path, function() { self._run(); });
  },

  pluginPath: function(plugin) {
    if(!~plugin.indexOf("xt/"))
      return "xt/%@".fmt(plugin.toLowerCase());
    else return plugin;
  },

  pluginStripPath: function(plugin) {
    return plugin.slice(3);
  },

  didLoad: function(plugin) {
    if(!plugin) return;
    var self = this;
    this.log("Plugin %@ was loaded".fmt(plugin.name));
    if(
      plugin.didLoad
      && SC.typeOf(plugin.didLoad) === SC.T_FUNCTION
      && plugin.get("isLoaded") !== YES) {
        this.queue(function() { plugin.didLoad(); });
        this._loaded[plugin.name.toLowerCase()] = plugin;
        if(this._waitingFor) {
          console.warn("WAITING FOR => ", this._waitingFor);
          this._loaded[this._waitingFor] = plugin;
          this._waitingFor = null;
        }
    }
    else this.warn("No didLoad function available on plugin");
    this.queue(function() { self.notifyDidLoad.call(self, plugin); });
  },

  getPlugin: function(path) {
    return this._loaded[path] || null;
  },

  isLoaded: function(path) {
    return ! SC.Module.loadModule(path);
  },

  load: function(target, callback, usePluginAsContext) {
    var r = SC.Module.loadModule(target, callback);
    if(r) {
      this.warn("Plugin already loaded?");
      console.warn(this._loaded);
      var plugin = this._loaded[this.pluginStripPath(target)];
      if(plugin && callback && SC.typeOf(callback) === SC.T_FUNCTION)
        if(usePluginAsContext)
          callback.call(plugin);
        else callback();
      if(plugin && plugin.didLoad)
        plugin.didLoad(); 
    }
  },

  notifyDidLoad: function(plugin) {
    // var activate = XT.Router.notifyDidLoad(plugin.name);
    // if(SC.none(activate)) return;
    // plugin.route(activate);
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

  _loaded: [],

  name: "XT.PluginManager",
}) ;
