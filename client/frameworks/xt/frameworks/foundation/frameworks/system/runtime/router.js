
/*globals XT */

sc_require("ext/object");

/** @namespace


*/

XT.ROUTER_DEFAULT_ROUTES = [":plugin", ":plugin/:target"];

XT.Router = XT.Object.create(
  /** @lends XT.Router */ { 
  
  /** @propery */
  name: "XT.Router",

  start: function() {
    this.log("Starting up");
    this.set("canRoute", YES);
    this.addRoutes(this, XT.ROUTER_DEFAULT_ROUTES, "routePlugin");
    return YES;
  },
  
  addRoutes: function(target, routes, method) {
    if(SC.none(method)) method = this.route;
    for(var i=0; i<routes.length; ++i) {
      SC.routes.add(routes[i], target, method);
    }
  },
  
  route: function(hash) {
    if(this.get("canRoute") !== YES) return;
  },

  routePlugin: function(hash) {
    if(this.get("canRoute") !== YES) return;
    this.log("Received plugin route request => %@".fmt(hash.plugin));
    this.stash(hash);
    XT.PluginManager.fetch(hash.plugin);
  },

  stash: function(hash) {
    if(hash) this._stash = hash;
    else return this._stash;
  }.property(),

  notifyDidLoad: function(plugin) {
    var stash = this.get("stash");
    if(SC.none(stash) || SC.none(plugin)) return NO;
    if(stash.plugin === plugin) {
      this.log("Stashed plugin was loaded (%@)".fmt(stash.plugin));
      this._stash = null;
      return stash;
    }
  },
  
  locationDidChange: function() {
    var _l = SC.routes.get("location"),
      l = this.get("location");
    if(_l !== l)
      SC.routes.set("location", l);
  }.observes("location"),
  
  locationBinding: SC.Binding.from("SC.routes.location").oneWay(),

  next: function() {
    var q = this._queue;
    if(q.length > 0) {
      var n = q.shift();
      this.set("location", n);
    }
  },

  queue: function(route) {
    this._queue.push(route);
  },

  clear: function() {
    delete this._queue;
    this._queue = [];
    return this;
  }
  
}) ;
