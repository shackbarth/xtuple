/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, issue:true */

(function () {
  "use strict";

  require("./ext/response");
  require("./ext/route");
  require("./ext/router");
  require('./ext/functor');
  require('./ext/session');

  var _ = XT._;

  XT.Server = XT.Object.extend({
    
    autoStart: false,

    port: null,

    name: null,

    useWebSocket: false,

    router: null,

    server: null,
  
    init: function () {
      var auto = this.get("autoStart"),
          port = this.get("port"),
          name = this.get("name"),
          router = this.get("router"),
          sockets = this.get("useWebSocket");
          
      if (!port) issue(XT.fatal("cannot create a server with no port"));
      if (!router && !sockets) issue(XT.fatal("cannot create a non-websocket server with no router"));
      if (!name) name = this.name = "NONAME%@".f(_.uniqueId("_server"));
      
      if (auto) {
        this.start();
      }
  
      XT.Server.registerServer(this);
    },

    sockets: function () {
      return this._io && this._io.sockets ? this._io.sockets : null;
    }.property(),

    start: function () {
      var s = this,
          p = this.get('port'),
          w = this.get('useWebSocket');
      try {
  
        // if a server has been manually created and set
        // just start it
        if (XT.none(s.server))
          s.server = XT.connect.createServer(
            function (req, res) {
              var r = s.get('router'); // allow swapping of routers
                                       // is that good?
              r.handle.call(r, req, res);
            }
          );
  
        // for overloaded server types such as one created
        // via connect this is the only way to ensure we
        // have the actual server object and not just the
        // handler
        s.server = s.server.listen(p);
        if (w) {
          s._io = require('socket.io').listen(s.server, {
            'log level': 0,
            'browser client': false,
            'origins': '*:*',
            'transports': [
              'websocket',
              'xhr-polling',
              'jsonp-polling'
            ]
          });
          s.emit('xtSocketsSet', s._io.sockets);
        }
      } catch (e) { issue(XT.fatal(e)); }
  
      XT.log("Started server, {name}, listening on port {port}".f(
        { name: s.get('name'), port: p }));
  
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
      XT.cleanup();
    }
  });
  
  XT.addCleanupTask(_.bind(XT.Server.closeAll, XT.Server));
}());