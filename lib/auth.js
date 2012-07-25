/*jshint node:true, bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";
  
  var _ = XT._, _path = XT.path;
  
  XT.Server.create({
    name: "Auth",
    port: XT.options.datasource.securePort,
    secure: true,
    keyFile: XT.options.datasource.secureKeyFile,
    certFile: XT.options.datasource.secureCertFile,
    init: function () {
      
      // the only reason this looks so sketch is because
      // we need to modify the handler stack, note the
      // overloaded route method
      var server, options, root;
      this._super.init.call(this);
      options = {
        key: this.get("key"),
        cert: this.get("cert")
      };
      server = XT.connect(options);
      root = _path.join(XT.basePath, "www");
      server.use(_.bind(this.redirect, this));
      server.use(_.bind(this.route, this));
      server.use(XT.connect.static(root, {redirect: true}));
      this.set("server", server);
      this.start();
    },
    router: XT.Router.create({
      routes: [XT.authRoute]
    }),
    redirect: function (req, res, next) {
      var url = req.url, host = req.headers.host;
      
      // TODO: CHANGE ME!
      if (!host) host = "localhost";
      if (url === "/") url = "https://%@/login";
      if (url !== req.url) {
        res.writeHead(302, {"Location": url});
        res.end();
      } else next();
    },
    route: function (req, res, next) {
      
      // here we want to allow the ajax request to access a path
      // that isn't really a path but if its not a known handler
      // then let it be dealt with by the static handler built
      // into connect
      
      // TODO: should this be a built-in capability?
      var xtr;
      (xtr = XT.Response.create({
        request: req,
        response: res
      })).once("isReady", _.bind(function () {
        var router = this.get("router"), routes = router.routes, path;
        path = xtr.get("path");
        if (routes[path]) {
          this.router.route.call(router, xtr);
        } else { next(); }
      }, this));
    }
  });
  
}());