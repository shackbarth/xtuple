
/*globals XT */

sc_require("ext/object");

/** @namespace


*/
XT.Router = XT.Object.create(
  /** @lends XT.Router */ { 
  
  /** @propery */
  name: "XT.Router",

  start: function() {
    this.log("Starting up");
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
