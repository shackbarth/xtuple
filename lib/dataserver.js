/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _ = X._, _path = X.path;

  // XXX how does this work without something like X.server = X.Server.create({... ?
  X.Server.create({
    name: "Data",
    port: X.options.datasource.securePort,
    router: X.dataRouter,
    useWebSocket: true,
    secure: true,
    keyFile: X.options.datasource.secureKeyFile,
    certFile: X.options.datasource.secureCertFile,
    init: function () {
      var server, options, root;
      this._super.init.call(this);
      options = {
        key: this.get("key"),
        cert: this.get("cert")
      };
      root = _path.join(X.basePath, "www");
      server = X.connect(options);
      server.use(X.connect.cookieParser());
      server.use(_.bind(this.redirect, this));
      server.use(_.bind(this.route, this));
      server.use(X.connect.static(root, {redirect: true}));
      this.set("server", server);
      this.start();
      this.setSocketHandler("/clientsock", "connection", _.bind(this.initSocket, this));
    },
    initSocket: function (socket) {
      var map = X.functorMap, handle, handler, func;
      for (handle in map) {
        if (!map.hasOwnProperty(handle)) continue;
        handler = map[handle];
        func = _.bind(handler.handle, handler);
        socket.on(handle, _.bind(this.handleSocketRequest, this, handle, socket, func, handler));
      }
      socket.emit("ok");
    },
    handleSocketRequest: function (path, socket, callback, handler, payload, ack) {
      var session, xtr = X.Response.create({
        path: path,
        socket: socket,
        data: payload,
        ack: ack
      });
      if (handler.needsSession) {
        session = X.Session.create(payload);
        session.once("isReady", function () {
          callback(xtr, session);
        });
        session.on("error", function () {
          xtr.error(session.get("error"));
        });
      } else callback(xtr);
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
      (xtr = X.Response.create({
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
