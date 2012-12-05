/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _ = X._, _path = X.path, _https = X.https;

  X.Server.create({
    name: "Data",
    port: X.options.datasource.port,
    bindAddress: X.options.datasource.bindAddress,
    keyFile: X.options.datasource.keyFile,
    certFile: X.options.datasource.certFile,
    caFile: X.options.datasource.caFile,
    secure: true,
    routers: [X.dataRouter, X.lookupRouter],
    useWebSocket: true,
    init: function () {
      var server, options = {}, root, app;
      this._super.init.call(this);
      root = _path.join(X.basePath, "www");

      options.key = this.get("key");
      options.cert = this.get("cert");
      if (this.get("passPhrase")) options.passPhrase = this.get("passPhrase");
      options.ca = this.get("ca");

      app = X.connect();
      app.use(X.connect.cookieParser());
      app.use(_.bind(this.route, this));
      app.use(_.bind(this.remap, this));
      app.use(X.connect.static(root, {redirect: true}));
      server = _https.createServer(options, app);
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
    // TODO: this doesn't work anymore...
    remap: function (req, res, next) {
      var url = req.url, host = req.headers.host;
      if (!url.match(/client/g) && !url.match(/login/g) && !url.match(/public-extensions/g)) {
        if (url[0] === "/") url = url.slice(1);
        req.url = url.pre("/client/");
      }
      next();
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
        var routers = this.get("routers"),
          router, routes, path = xtr.get("path"), i = 0;

        for (; i < routers.length; ++i) {
          router = routers[i];
          routes = router.routes;
          if (routes[path]) {
            router.route.call(router, xtr);
            return;
          }
        }

        // if we got here, next handler in the stack...
        next();

      }, this));
    }
  });
}());
