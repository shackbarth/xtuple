/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _ = X._, _path = X.path, _https = X.https, _http = X.http;

  X.Server.create({
    name: "Data",
    //port: X.options.datasource.securePort,
    port: X.options.datasource.port,
    bindAddress: X.options.datasource.bindAddress,
    router: X.dataRouter,
    useWebSocket: true,
    //secure: true,
    //keyFile: X.options.datasource.secureKeyFile,
    //certFile: X.options.datasource.secureCertFile,
    //caFile: X.options.datasource.secureCaFile,
    //passPhrase: X.options.datasource.securePassPhrase,
    init: function () {
      var server, options, root, app;
      this._super.init.call(this);
      //options = {
      //  key: this.get("key"),
      //  cert: this.get("cert"),
      //  ca: this.get("ca")
      //};
      root = _path.join(X.basePath, "www");
      app = X.connect();
      app.use(X.connect.cookieParser());
      //app.use(_.bind(this.redirect, this));
      app.use(_.bind(this.route, this));
      app.use(X.connect.static(root, {redirect: true}));
      //server = _https.createServer(options, app);
      server = _http.createServer(app);
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
