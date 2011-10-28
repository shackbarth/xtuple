
/*globals XT */

/** @namespace


*/
XT._router = SC.Object.create(
  /** @lends XT._router */ { 
  
  init: function() {
    sc_super();
    SC.routes.add(":plugin", this, this.route);
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
      SC.routes.set("location", this.get("location"));
  }.observes("location"),
  
  locationBinding: SC.Binding.from("SC.routes.location").oneWay(),
  
}) ;