/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";
  
  var _ = XT._, _path = XT.path;
  
  XT.Server.create({
    name: "Data",
    port: XT.options.datasource.securePort,
    router: XT.dataRouter,
    useWebSocket: true,
    secure: true,
    keyFile: XT.options.datasource.secureKeyFile,
    certFile: XT.options.datasource.secureCertFile,
    init: function () {
      var server, options, root;
      this._super.init.call(this);
      options = {
        key: this.get("key"),
        cert: this.get("cert")
      };
      root = _path.join(XT.basePath, "www");
      server = XT.connect(options);
      server.use(XT.connect.cookieParser());
      server.use(_.bind(this.redirect, this));
      server.use(_.bind(this.route, this));
      server.use(XT.connect.static(root, {redirect: true}));
      this.set("server", server);
      this.start();
      this.setSocketHandler("/clientsock", "connection", _.bind(this.initSocket, this));
    },
    initSocket: function (socket) {
      var map = XT.functorMap, handle, handler, func;
      for (handle in map) {
        if (!map.hasOwnProperty(handle)) continue;
        handler = map[handle];
        func = _.bind(handler.handle, handler);
        socket.on(handle, _.bind(this.handleSocketRequest, this, handle, socket, func, handler));
      }
      socket.emit("ok");
    },
    handleSocketRequest: function (path, socket, callback, handler, payload, ack) {
      var xtr = XT.Response.create({
        path: path,
        socket: socket,
        data: payload,
        ack: ack
      });
      if (handler.needsSession) callback(xtr, XT.Session.create(payload));
      else callback(xtr);
    },
    redirect: function (req, res, next) {
      var url = req.url, host = req.headers.host;
      
      // TODO: CHANGE ME!
      if (!host) host = "localhost";
      if (url === "/") url = "%@/client".f(host);
      if (url !== req.url) {
        res.writeHead(302, {"Location": "https://%@".f(url)});
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