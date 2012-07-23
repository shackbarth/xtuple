/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, issue:true */

(function () {
  "use strict";

  require("./ext/response");
  require("./ext/route");
  require("./ext/router");
  require('./ext/functor');

  var _ = XT._, _fs = XT.fs, _path = XT.path;

  XT.Server = XT.Object.extend({
    autoStart: false,
    port: null,
    name: null,
    useWebSocket: false,
    router: null,
    server: null,
    secure: false,
    keyFile: null,
    certFile: null,
    init: function () {
      var auto = this.get("autoStart"),
          port = this.get("port"),
          name = this.get("name"),
          router = this.get("router"),
          sockets = this.get("useWebSocket");
          
      if (!name) name = this.name = "NONAME%@".f(_.uniqueId("_server"));
      if (!port) issue(XT.fatal("cannot create a server with no port %@".f(name)));
      if (!router && !sockets) issue(XT.fatal("cannot create a non-websocket server with no router"));

      if (auto) this.start();
  
      XT.Server.registerServer(this);
    },
    sockets: function () {
      return this._io && this._io.sockets ? this._io.sockets : null;
    }.property(),
    route: function (req, res) {
      var router = this.get("router");
      if (router) router.handle.call(router, req, res);
    },
    cert: function () {
      var file = this.get("certFile");
      return _fs.readFileSync(_path.join(XT.basePath, file), "utf8");
    }.property(),
    key: function () {
      var file = this.get("keyFile");
      return _fs.readFileSync(_path.join(XT.basePath, file), "utf8");
    }.property(),
    start: function () {
      var port = this.get("port"), useSockets = this.get("useWebSocket"), 
          generator = this.get("generator"), server, app = this.server, options = {},
          secure = this.get("secure");
          
      if (secure) {
        options.key = this.get("key");
        options.cert = this.get("cert");
      }
          
      // TODO: remove this from a try/catch but test for consequences in fail case...
      // right now it wraps unintended sub-calls
      try {
        if (XT.none(app)) {
          if (secure) app = XT.connect(options).use(_.bind(this.route, this));
          else app = XT.connect().use(_.bind(this.route, this));
        }
        
        server = this.server = app.listen(port);
        
        if (useSockets) {
          this._io = require("socket.io").listen(server, {
            "log level": 0,
            "browser client": false,
            "origins": "*:*",
            "transports": [
              "websocket",
              "xhr-polling",
              "jsonp-polling"
            ]
          });
        }
      } catch (err) { issue(XT.fatal(err)); }
  
      XT.log("Started %@server, %@, listening on port %@".f(secure? "secure ": "", this.get("name"), port));
  
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
        XT.log("Server: '%@' shutting down.".f(this.get('name')));
        this.server.close();
      }
      return this;
    },
    className: "XT.Server"
  });
  
  
  XT.mixin(XT.Server, {

    activeServers: {},

    registerServer: function (server) {
      var name = server.get('name'),
          servers = this.activeServers;
      if (servers[name]) {
        issue(XT.warning("Registering server but under unique name " +
          "because a server by that name already existed (%@ => %@)".f(
          name, server.get('uid'))));
        name = server.get('uid');
      }
      this.activeServers[name] = server;
    },

    closeAll: function () {
      XT.log("Shutting down all active servers.");
      var servers = this.activeServers,
          names = Object.keys(servers), i, name, server;
      for (i = 0; i < names.length; ++i) {
        name = names[i];
        server = servers[name];
        if (server) server.close();
      }
    }
  });
  
  XT.addCleanupTask(_.bind(XT.Server.closeAll, XT.Server));
}());