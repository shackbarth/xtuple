
/*globals XT */

/** @namespace

  PRE ALPHA VERSION HACKED TOGETHER FOR TESTING ONLY!

  @extends SC.Object
*/
XT._xbo_manager = SC.Object.create(
  /** @lends XT._xbo_manager */ {
  
  load: function(xbo) {
    if(this._last_request && this._last_request.name === xbo.name)
      throw "Attempt to load XBO that previously failed";
    this._last_request = xbo;
    console.log("loading => ", xbo);
    if(this.xboIsLoaded(xbo))
      throw "Attempt to load  xbo that is already loaded";
    var name = xbo.name, self = this;
    SC.Module.loadModule("xt/" + name,
      function() {
        self.patch(xbo);
      });
  },
  
  _last_request: null,
  
  patch: function(xbo) {
    console.log("patching => ", xbo);
    var useGlobal = NO, _xbo, target;
    if(!this.xboIsLoaded(xbo)) {
      var name = "XT." + XT.capitalize(xbo.name);
      _xbo = SC.objectForPropertyPath(name);
      if(!_xbo) {
        this.load(xbo);
        return;
      }
      useGlobal = YES;
    }
    if(xbo.ext && !this.patchIsApplied(xbo)) {
      _xbo = useGlobal ? _xbo : this.xboFromName(xbo.name), target;
      if(!_xbo)
        throw "Can't get reference to XBO object";
      target = SC.objectForPropertyPath(_xbo.model);
      if(!target)
        throw "Cannot find XBO target to patch";
      target.reopen(xbo.ext);
      this.didPatch(xbo);
    }
  },
  
  xboIsLoaded: function(xbo) {
    return !! this.xboFromName(xbo.name);
  },
  
  patchIsApplied: function(xbo) {
    return this._patches.indexOf(xbo.ext) !== -1;
  },
  
  didPatch: function(xbo) {
    this._patches.push(xbo.ext);
  },
  
  didLoad: function(xbo) {
    console.log("didLoad CALLED FOR => ", xbo);
    this._loaded.push(xbo);
  },
  
  xboFromName: function(name) {
    console.log("trying to find xbo by name =>", name);
    return this._loaded.find(function(xbo) {
      console.log("the search found => ", xbo);
      var ret = xbo.name === name;
      console.log("did they match? => ", ret);
      return xbo.name === name;
    });
  },
  
  _patches: [],
  
  _loaded: [],
  
}) ;