
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
XT.server = XT.Object.extend(
  /** @lends XT.server.prototype */ {
  
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
    The HTTP server reference created once the XT.server has
    been instanced.

    @private
  */
  _server: null,

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
        n = this.get('name') || XT.server.name();
    if(XT.none(p))
      throw XT.fatal("Could not create server {name}, no port provided".f(
        { name: n }));
    else if(r) r.set('server', this);
    if(a) this.start();
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
      if(XT.none(s._server))
        s._server = XT.connect.createServer(
          function(req, res) {
            var r = s.get('router'); // allows swapping of routers
                                     // is that good?
            r.handle.call(r, req, res); 
          }
        );
      s._server.listen(p);
      if(w) {
        s._io = require('socket.io').listen(s._server);
        s._io.set('log level', 0);
        s.emit('xtSocketsSet', s._io.sockets);
      }
    } catch(e) { issue(XT.fatal(e)); }

    XT.log("Started server, {name}, listening on port {port}".f(
      { name: s.get('name'), port: p }));

    return this;
  }

});


XT.mixin(XT.server,
  /** @lends XT.server */ {

});
