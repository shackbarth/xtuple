
/*globals XT */

/** @class

  @extends SC.Object
*/
XT.Plugin = SC.Object.extend(SC.StatechartManager,
  /** @scope XT.Plugin.prototype */ {
  
  init: function() {
    sc_super();
    this._xbo_ext = [];
  },
  
  noXBO: NO,
  
  _xbo_ext: [],
  
  xbos: function(xbos) {
    console.log("xbos called on a plugin for => ", xbos);
    var keys = XT.keysFor(xbos);
    console.log(keys);
    for(var i=0; i<keys.length; ++i) {
      var target = keys[i];
      this._xbo_ext.push({ name: target, ext: xbos[target] });
    }
    
    // @todo This is NOT a good long-term solution
    this.sendEvent("work");
  },
  
  addRoutes: function(routes) {
    XT._router.addRoutes(this, routes);
  }
  
}) ;