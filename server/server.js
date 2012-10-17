/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, issue:true */

(function () {
  "use strict";

  require("./ext/response");
  require("./ext/route");
  require("./ext/router");
  require('./ext/functor');

  var _ = X._, _fs = X.fs, _path = X.path, _https = X.https;
  /**
    The node server.

    @class
    @extends X.Object
   */
  X.Server = X.Object.extend(/** @lends X.Server */{
    autoStart: false,
    port: null,
    name: null,
    useWebSocket: false,
    router: null,
    server: null,
    secure: false,
    keyFile: null,
    certFile: null,
    passPhrase: null,
    caFile: null,
    bindAddress: null,
    parseCookies: false,
    isRunning: false,
    /**
      Initializes server
    */
    init: function () {
      var auto = this.get("autoStart"),
          port = this.get("port"),
          name = this.get("name"),
          router = this.get("router"),
          sockets = this.get("useWebSocket");

      if (!name) name = this.name = "NONAME%@".f(_.uniqueId("_server"));
      if (!port) {
        issue(X.fatal("cannot create a server with no port %@".f(name)));
      }
      //if (!router && !sockets) issue(X.fatal("cannot create a non-websocket server with no router"));

      if (auto) this.start();

      X.Server.registerServer(this);
    },

    /**
      Returns sockets if they exist

      @method X.Server.sockets
     */
    sockets: function () {
      return this._io && this._io.sockets ? this._io.sockets : null;
    }.property(),

    /**
     Routes a request.
     */
    route: function (req, res) {
      var router = this.get("router");
      if (router) router.handle.call(router, req, res);
    },

    /**
      Synchronously returns the cert file

      @method X.Server.cert
     */
    cert: function () {
      var file = this.get("certFile");
      return _fs.readFileSync(_path.join(X.basePath, file));
    }.property(),

    key: function () {
      var file = this.get("keyFile");
      return _fs.readFileSync(_path.join(X.basePath, file));
    }.property(),
    
    ca: function () {
      var file = this.get("caFile");
      if (!file) return null;
      if (X.typeOf(file) !== X.T_ARRAY) file = [file];
      return file.map(function (caFile){return _fs.readFileSync(_path.join(X.basePath, caFile))});
    }.property(),

    start: function () {
      var port = this.get("port"), useSockets = this.get("useWebSocket"),
          generator = this.get("generator"), server, app = this.server, options = {},
          secure = this.get("secure"), bindAddress = this.get("bindAddress"),
          cookies = this.get("parseCookies");

      if (secure) {
        options.key = this.get("key");
        options.cert = this.get("cert");
        if (this.get("passPhrase")) options.passPhrase = this.get("passPhrase");
        options.ca = this.get("ca");
        
        //X.debugging = true;
        //X.debug(options);
      }

      // TODO: remove this from a try/catch but test for consequences in fail case...
      // right now it wraps unintended sub-calls
      try {
        if (X.none(app)) {
          //if (secure) app = X.connect(options).use(_.bind(this.route, this));
          //else app = X.connect().use(_.bind(this.route, this));
          //if (secure) app = X.connect(X.https.createServer(options));
          //else app = X.connect();
          app = X.connect();

          if (cookies) app.use(X.connect.cookieParser());
          app.use(_.bind(this.route, this));
          
          if (secure) app = _https.createServer(options, app);
        }

        app.on("listening", _.bind(function () {this.set("isRunning", true)}, this));

        if (bindAddress) server = this.server = app.listen(port, bindAddress);
        else server = this.server = app.listen(port);

        if (useSockets) {
          //this._io = require("socket.io").listen(server);
          this._io = require("socket.io").listen(server, X.mixin({
            "log level": 0,
            //"browser client": true,
            "origins": "*:*",
            "transports": [
              "websocket",
              "xhr-polling",
              "jsonp-polling"
            ]
          }, options));
        }
      } catch (err) { issue(X.fatal(err)); }

      X.log("Started %@server, %@, listening on port %@".f(secure? "secure ": "", this.get("name"), port));

      return this;
    },
    setSocketHandler: function (namespace, event, callback, context) {
      var io = this._io;
      callback = context? _.bind(callback, context): callback;
      io.of(namespace).on(event, function (socket) {
        callback(socket);
      });
    },
    socketsFor: function (namespace) {
      var io = this._io,
          ns = io.namespaces[namespace];
      if (ns && ns.sockets) return ns.sockets;
    },
    close: function () {
      if (this.server) {
        X.log("Server: '%@' shutting down.".f(this.get('name')));
        if (this.get("isRunning")) this.server.close();
      }
      return this;
    },
    className: "X.Server"
  });


  X.mixin(X.Server, {

    activeServers: {},

    registerServer: function (server) {
      var name = server.get('name'),
          servers = this.activeServers;
      if (servers[name]) {
        issue(X.warning("Registering server but under unique name " +
          "because a server by that name already existed (%@ => %@)".f(
          name, server.get('uid'))));
        name = server.get('uid');
      }
      this.activeServers[name] = server;
    },
    
    getServer: function (name) {
      return this.activeServers[name];
    },

    closeAll: function () {
      X.log("Shutting down all active servers.");
      var servers = this.activeServers,
          names = Object.keys(servers), i, name, server;
      for (i = 0; i < names.length; ++i) {
        name = names[i];
        server = servers[name];
        if (server) server.close();
      }
    }
  });

  X.addCleanupTask(_.bind(X.Server.closeAll, X.Server));
}());
