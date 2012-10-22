/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _ = X._, _path = X.path, proxyRouter = X.Router.create({
    dropOnNotFound: false,
    routes: [X.userRoute, X.databaseRoute, X.datasourceRoute, X.organizationRoute]
  });

  X.Server.create({
    name: "Administrator Interface",
    port: X.options.administratorInterface.port,
    router: proxyRouter,
    autoStart: true,
    bindAddress: "localhost",
    init: function () {
      var server = X.connect(), root;
      root = _path.join(X.basePath, "www");
      server.use(_.bind(this.route, this));
      server.use(X.connect.static(root, {redirect: true}));
      this.set("server", server);
      this._super.init.call(this);
    },
    route: function (req, res, next) {

      // here we want to allow the ajax request to access a path
      // that isn't really a path but if its not a known handler
      // then let it be dealt with by the static handler built
      // into connect

      // TODO: should this be a built-in capability?
      var xtr;
      (xtr = X.Response.create({
        request: req,
        response: res
      })).once("isReady", _.bind(function () {

        var router = this.get("router");
        if (!router.route(xtr)) next();

        //var router = this.get("router"), routes = router.routes, path;
        //path = xtr.get("path");
        //if (routes[path]) {
        //  this.router.route.call(router, xtr);
        //} else { next(); }
      }, this));
    }
  });

}());
