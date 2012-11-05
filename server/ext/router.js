/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _ = X._, _path = X.path;

  /**
    Sends a request to the appropriate request handler.

    @class
    @extends X.Object
   */
  X.Router = X.Object.extend(/** @lends X.Router */{
    /**
      Determines behavior for requests whose routing cannot be determined.

      @type {Boolean}
     */
    dropOnNotFound: true,

    /**
      Init.


     */
    init: function () {
      var routes = this.routes, map, mapr;
      map = this.routes = {}, mapr = this.regexRoutes = [];
      //X.debug("X.Router.init(): ", routes);
      // this is ok because it is a one-time nested loop
      // during initialization of router(s) at datasource
      // startup
      _.each(routes, function (route) {
        _.each(route.handles, function (handle) {
          if (X.typeOf(handle) === X.T_STRING) map[handle] = route;
          else mapr.push({expr: handle, route: route});
        });
      });

      //X.debug(mapr);
      //X.debug("X.Router.init(): ", routes);
    },

    /**
      Routes a request to the appropriate request handler

      @param {X.Response} xtr The response object.
     */
    route: function (xtr) {
      var path = xtr.get("path"), regexRoutes = this.regexRoutes || [], match, handler, filter;

      //console.log("route(): ", path, Object.keys(this.routes), this.routes[path]);
      //X.debug("X.Router.route(): ", path);

      // arbitrary check since some browsers automatically
      // request a favicon.ico
      if (path.match(/\.ico/g)) {
        xtr.error("I don't offer a favicon.ico");
        return true;
      } else if ((handler = this.routes[path]) || (handler = this.routes["*"])) {
        handler.handle(xtr);
        //X.debug("X.Router.route(): returning true for match exact path or *");
        return true;
      } else {
        filter = _.filter(regexRoutes, function (regex) {
          //X.debug("REGEX: ", regex, ", path: ", path);
          var route = regex.route.handle;
          match = regex.expr.exec(path);
          //console.log(match);
          //if ((match = regex.expr.exec(path))) {
          if (match) {
            match = match.slice(1); // remove the inital match of full string
            match.unshift(xtr);
            route.apply(regex.route, match);
            return true;
          } else return false;
        }, this);
        if (filter && filter.length > 0) {
          //X.debug("X.Router.route(): filter was ", filter);
          return true;
        }
      }
      this.drop(xtr);
      //X.debug("returning false");
      return false;
    },

    /**
      Creates a response and dispatches it ass soon as the request handler
      is ready.
     */
    handle: function (req, res) {
      var xtr;
      (xtr = X.Response.create({
        request: req,
        response: res
      })).once("isReady", _.bind(this.route, this, xtr));
    },

    /**
      Drops request

      @param {X.Response} xtr
     */
    drop: function (xtr) {
      if (this.get("dropOnNotFound")) xtr.error("You just have no clue do you?");
    },

    /**
      Known routes.

      @type {Array}
     */
    routes: [],

    /**
      Known regex routes.

      @type {Array}
     */
    regexRoutes: [],

    className: "X.Router"
  });

  X.run(function () {
    var path, files;

    if (!X.routersDirectory) return;

    path = _path.join(X.basePath, X.routersDirectory);

    X.log("Loading routers from %@".f(
      X.shorten(path, 3)));

    files = X.directoryFiles(path, {extension: ".js", fullPath: true});
    _.each(files, function (file) {
      require(file);
    });
  });

}());


