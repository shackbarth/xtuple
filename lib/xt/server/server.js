
/** */      require('./ext/router');
/** */      require('./ext/functor');
/** */      require('./ext/route');
/** */      require('./ext/response');

/** @namespace
  The server if a fundamental object that can be created/instanced to
  server various purposes. It also has some convenience features
  and static methods as helpers.
*/
xt.server = xt.object.extend(
  /** @lends xt.server.prototype */ {
  
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
    The router for the server to use when it receives
    requests. If none is provided it will use a default
    router.

    @type {Router}
    @default xt.router_default
  */
  router: xt.router_default,
  
  /**
    The HTTP server reference created once the xt.server has
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
        n = this.get('name') || xt.server.name();
    if(xt.none(p))
      throw xt.fatal("Could not create server {name}, no port provided".f(
        { name: n }));
    if(xt.none(r))
      throw xt.fatal("Could not create server {name}, router is invalid".f(
        { name: n }));
    else
      r.set('server', this);
    if(a) this.start();
  },

  /**
    Starts the server with the properties set on it.

    @method
    @returns Callee
  */
  start: function() {
    var s = this,
        p = this.get('port');
    try {
      s._server = xt.http.createServer(
        function(req, res) {
          var r = s.get('router'); // allows swapping of routers
                                   // is that good?
          r.handle.call(r, req, res); 
        }
      ).listen(p);
    } catch(e) { xt.exception.handle(xt.fatal(e)); }

    xt.log("Started server, {name}, listening on port {port}".f(
      { name: s.get('name'), port: p }));

    return this;
  }

});


xt.mixin(xt.server,
  /** @lends xt.server */ {

});
