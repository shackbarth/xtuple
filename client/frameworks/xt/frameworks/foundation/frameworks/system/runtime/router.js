
/*globals XT */

/** @namespace


*/
XT.Router = SC.Object.create(
  /** @lends XT.Router */ { 
  
  init: function() {
    sc_super();
  },

  start: function() {
    console.log("starting router");
    return YES;
  },
  
  addRoutes: function(target, routes) {
    for(var i=0; i<routes.length; ++i) {
      SC.routes.add(routes[i], target, this.route);
    }
  },
  
  route: function(hash) {
    console.log("received route request => ", hash);
    console.log(XT.keysFor(hash));
  },
  
  locationDidChange: function() {
    var _l = SC.routes.get("location"),
      l = this.get("location");
    if(_l !== l)
      SC.routes.set("location", l);
  }.observes("location"),
  
  locationBinding: SC.Binding.from("SC.routes.location").oneWay(),
  
}) ;
