
/*globals Xbo */

sc_require("runtime/common");

/** @class

*/
Xbo.Controller = XT.Object.create(
  /** @scope Xbo.prototype */ {


  //..........................................
  // Public Properties
  //

  /** @property */
  availableXbos: null,

  /** @property */
  loadedXbos: null,

  /** @private
    When a Plugin is loaded and desires to patch a Xbo,
    whther it be for a View enhancement, binding or model
    enhancement, the Xbo has to be available. If the Xbo
    is not loaded yet (may never be in some cases) the proposed
    patch gets stored here waiting. Each time an Xbo is loaded
    the controller checks to see if there are any patches waiting
    to be applied to it.
  */
  queuedPatches: {},


  //..........................................
  // Calculated Properties
  //


  //..........................................
  // Public Methods
  //

  /** @public
    Loads a requested Xbo (asynchronously) and executes any callbacks
    supplied. Can take any number of callbacks to be executed synchronously
    upon the Xbo being completely loaded.
  */
  load: function() {
    var args = Array.prototype.slice.call(arguments),
        request = args.shift();
    this._load(request, args);
    return YES;
  },

  /** @public
    Test to see if the request is actually a known
    Xbo (either form - literal Xbo name or SC/module format).
  */
  isXbo: function(request) {
    return !! this._xbos[request];
  },

  /** @public
    Returns whether or not the requested Xbo is loaded.
  */
  isLoaded: function(request) {
    return this.get("loadedXbos").contains(request);
  },

  /** @public
    Returns whether or not the requested Xbo is a core Xbo.
  */
  isCore: function(request) {
    if(!this.isXbo(request)) return NO;
    return this._core.indexOf(request >= 0);
  },

  /** @public
    Register a patch to be applied to a particular Xbo. If the
    Xbo is already loaded it will be applied immediately. If it
    is not loaded, it will be queued until it is available, if ever.
  */
  registerPatch: function(patch, target) {
    var q = this.get("queuedPatches"),
        name;
    if(SC.typeOf(target) === SC.T_OBJECT)
      name = target.name;
    else name = target;
    if(this.isLoaded(target)) {
      var x = this.get(target);
      return x.patch(patch);
    }
    if(!q[name]) q[name] = [];
    q[name].push(patch);
  },

  //..........................................
  // Bindings
  //

  _statusBinding: SC.Binding.from("XT.Session.isActive").oneWay(),

  //..........................................
  // Private Methods
  //

  /** @private */
  _moduleFor: function(request) {
    var x = this._xbos;
    return x[request].module;
  },

  /** @private */
  _didLoadXbo: function(request) {
    var name = this._xbos[request].name,
        xbo = SC.objectForPropertyPath(name);
    xbo.set("moduleName", request);
    xbo.set("controller", this);
    this.set(request, xbo);
    this.set(name, xbo);
    this.get("loadedXbos").push(name);
    this.get("loadedXbos").push(request);
    xbo.set("isRegistered", YES);
    this.log("Just registered %@ (%@)".fmt(name, request));
    this._invokePatchesFor(name);
  },

  /** @private */
  _processXbos: function() {
    var d = this._deferred,
        p = this._prefetched,
        i = this._inlined,
        c = [].concat(d, p, i),
        xbos = {}, modules = {}, core = [];
    c.filter(function(loadable) {
      if(loadable && loadable.type === "xbo") {
        modules[loadable.module] = loadable;
        xbos[loadable.module] = loadable;
        xbos[loadable.name] = loadable;
        if(loadable.core === YES) {
          core.push(loadable.module);
        }
        return YES;
      }
      return NO;
    });
    this._loadables = modules;
    this._xbos = xbos;
    this._core = core;
    this.set("availableXbos", this._xbos);
    this._loadCore();
  },

  /** @private */
  _loadCore: function() {
    var c = this.get("_core"), i=0;
    if(!c || c.length <= 0) {
      this.warn("There are no core Xbos to load!");
      return YES;
    }
    this.log("There are %@ core Xbos to load!".fmt(c.length));
    for(; i<c.length; ++i) {
      this.log("Attempting to load %@".fmt(c[i]));
      this._load(c[i]);
    }
  },

  /** @private */
  init: function() {
    arguments.callee.base.apply(this, arguments);
    this._info = XT.__LOADABLEINFO__;
    this._deferred = this._info.DEFERRED;
    this._prefetched = this._info.PREFETCHED;
    this._inlined = this._info.INLINED;
    this._loaded = {};
    this._processXbos();
    this.set("loadedXbos", []);
  },

  /** @private */
  _invokePatchesFor: function(name) {

  },

  /** @private */
  _load: function(request, callbacks) {
    if(!this.get("_status") && !this.isCore(request)) {
      this.error("Cannot load Xbos without an active session (%@)".fmt(request));
      return;
    }
    if(!this.isXbo(request)) this.error("Request for non-xbo `%@`".fmt(request), YES);
    request = this._moduleFor(request);

    // console.warn("_load: Xbo was not loaded! (%@)".fmt(request));

    var self = this, func;
    func = function() {
      self._didLoadXbo(request);
      self._invokeCallbacks(callbacks, request);
    };

    // console.warn("_load (Xbo): ", request, callbacks, func);

    // SC.ready(function() { SC.Module.loadModule(request, func); });
    SC.ready(func); // FIXME
  },

  /** @private */
  _invokeCallbacks: function(callbacks, request) {
    if(SC.none(callbacks)) return;
    if(SC.typeOf(callbacks) !== SC.T_ARRAY)
      if(SC.typeOf(callbacks) === SC.T_FUNCTION) {
        callbacks = [callbacks];
      } else { this.error("Callbacks are supposed to be an array of functions", YES); }
    var xbo = this.get(request), i=0;
    for(; i<callbacks.length; ++i)
      callbacks[i](plugin); 
  },

  //..........................................
  // Private Properties
  //

  /** @private */
  name: "Xbo.Controller",

}) ;
