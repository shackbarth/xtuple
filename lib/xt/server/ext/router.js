/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";
  
  var _ = XT._, _path = XT.path;
  
  XT.Router = XT.Object.extend({
    
    init: function () {
      var routes = this.routes, map;
      map = this.routes = {};
      
      // this is ok because it is a one-time nested loop
      // during initialization of router(s) at datasource
      // startup
      _.each(routes, function (route) {
        _.each(route.handles, function (handle) {
          map[handle] = route;
        });
      });
    },
    
    route: function (xtr) {
      var path = xtr.get("path");
      
      console.log("route(): ", path, Object.keys(this.routes), this.routes[path]);
      
      // arbitrary check since some browsers automatically
      // request a favicon.ico
      if (path.match(/\.ico/g)) xtr.error("I don't offer a favicon.ico");
      else if (this.routes[path]) this.routes[path].handle(xtr);
      else this.drop(xtr);
    },
    
    handle: function (req, res) {
      var xtr;
      (xtr = XT.Response.create({
        request: req,
        response: res
      })).once("isReady", _.bind(this.route, this, xtr));
    },
    
    drop: function (xtr) {
      xtr.error("You just have no clue do you?");
    },
    
    routes: [],
    
    className: "XT.Router"
  });
  
  XT.run(function () {
    var path = _path.join(__dirname, "../routers"), files;
    
    XT.log("Loading available routers from %@".f(
      XT.shorten(path, 5)));
    
    files = XT.directoryFiles(path, {fullPath: true});
    _.each(files, function (file) {
      require(file);
    });
  });
  
}());


