
/** */      require('./ext/router');
/** */      require('./ext/functor');
/** */      require('./ext/route');
/** */      require('./ext/response');
/** */      require('./ext/session');
/** */      require('./ext/session_store');

/** @namespace
  The server if a fundamental object that can be created/instanced to
  server various purposes. It also has some convenience features
  and static methods as helpers.
*/
XT.Server = XT.Object.extend(
  /** @lends XT.Server.prototype */ {
  
  /**
    If this is set to YES then the server
    will automatically attempt to start itself upon
    being created.

    @type {Boolean}
    @default NO
  */
  autoStart: NO,

  /**
    The port for the server to bind to.

    @type {Number}
    @default null
  */
  port: null,

  /**
    Human-readable identifier for the server. Will be
    randomly generated if one is not provided. If one
    is provided it can be used to grab a reference
    to the server once it has been created.

    @type {String}
    @default null
  */
  name: null,

  /**
    Enable websockets on the server.

    @type {Boolean}
    @default NO
  */
  useWebSocket: NO,

  /**
    The router for the server to use when it receives
    requests. If none is provided it will use a default
    router from the stack.

    @type {Router}
    @default null
  */
  router: null,
  
  /**
    The HTTP server reference created once the XT.Server has
    been instanced.

    @private
  */
  server: null,

  /**
    During initialization it the server determines the appropriate
    properties and then waits to be started (or auto-starts if
    autoStart is set to true).
    
    @private
  */
  init: function() {
    var p = this.get('port'),
        r = this.get('router'),
        a = this.get('autoStart'),
        n = this.get('name') || XT.Server.name();
    if(XT.none(p))
      throw XT.fatal("Could not create server {name}, no port provided".f(
        { name: n }));
    else if(r) r.set('server', this);
    if(a) this.start();
    XT.Server.registerServer(this);
  },

  /**
    If sockets are enabled and running this will
    return the socket. Must use `get` to retrieve
    the socket property.
    
    @type Object
    @property
  */
  sockets: function() {
    return this._io && this._io.sockets ? this._io.sockets : null;
  }.property(),

  /**
    Starts the server with the properties set on it.
    If web sockets are enabled on this server it will
    emit a trigger 'xtSocketsSet' when the socket can
    be retrieved for setting responders. The socket
    can be retrieved via the 'socket' property on the
    server if it exists.

    @method
    @returns Callee
  */
  start: function() {
    var s = this,
        p = this.get('port'),
        r = this.get('router'),
        w = this.get('useWebSocket');
    try {

      // if a server has been manually created and set
      // just start it
      if(XT.none(s.server))
        s.server = XT.connect.createServer(
          function(req, res) {
            var r = s.get('router'); // allows swapping of routers
                                     // is that good?
            r.handle.call(r, req, res); 
          }
        );
      s.server.listen(p);
      if(w) {
        s._io = require('socket.io').listen(s.server);
        s._io.set('log level', 0);
        s.emit('xtSocketsSet', s._io.sockets);
      }
    } catch(e) { issue(XT.fatal(e)); }

    XT.log("Started server, {name}, listening on port {port}".f(
      { name: s.get('name'), port: p }));

    return this;
  },

  /**
    Since a server may handle multiple domains they can be
    registered via a socket handler. Provide the namespace
    and the event and all socket requests on that domain will
    be processed via the callback and context provided.

    @param {String} namespace The namespace of the domain usually
      of the form '/exampmle'.
    @param {String} event The name of the event to respond to.
    @param {Function} callback The method to invoke when the event
      is encountered.
    @param {Object} [context] The context under which to execute
      the callback.
  */
  setSocketHandler: function(namespace, event, callback, context) {
    var io = this._io;
    io.of(namespace).on(event, function(socket) {
      callback.call(context, socket);
    });
  },

  /**
    Retrieve a hash by socket-id of all sockets known
    to exist in a specified domain.

    @param {String} namespace The namespace from which to
      pull sockets.
    @returns {Object} The hash by socket-id of sockets in
      the domain.
  */
  socketsFor: function(namespace) {
    var io = this._io,
        ns = io.namespaces[namespace];
    if(ns && ns.sockets) return ns.sockets;
  },

  /**
    If the server is running, shut it down. 
  */
  close: function() {
    if(this.server) {
      XT.log("Server: '%@' shutting down.".f(this.get('name')));
      this.server.close();
    }
    return this;
  }

});


XT.mixin(XT.Server,
  /** @lends XT.Server */ {

  activeServers: {},

  registerServer: function(server) {
    var name = server.get('name'),
        servers = this.activeServers;
    if(servers[name]) {
      issue(XT.warning("Registering server but under unique name "
        + "because a server by that name already existed (%@ => %@)".f(
        name, server.get('uid'))));
      name = server.get('uid'); 
    }
    this.activeServers[name] = server;
  },

  closeAll: function() {
    XT.log("Shutting down all active servers.");
    var servers = this.activeServers,
        names = XT.keys(servers), i, name, server;
    for(i=0; i<names.length; ++i) {
      name = names[i];
      server = servers[name];
      if(server) server.close();
    }
  },

});
