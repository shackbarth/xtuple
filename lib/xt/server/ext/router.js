
/** @namespace
  Routers provide a mechanism (and the possibility for) custom handling for
  specific types of requests. They are instanced and used by individual
  servers to handle their incoming requests. In their most basic form routers
  are comprised of a single-entry API (handle) that the server passes the
  opened server response object and the native server request object.
*/
xt.router = xt.object.extend(
  /** @lends xt.router.prototype */ {

  /**
    This method is used by the router to determine if it knows of any
    routes capable of handling the request. While it can be overloaded
    it should generally not be modified or called directly.

    @param {Object} xtr The xt response object.

    @method
  */
  route: function(xtr) {
    var r = this.get('routes');
    if(xt.none(xtr))
      return issue(xt.warning(
        "Cannot route non-xt.response object or none present"));

    // favicon requests are dropped arbitrarily for now
    if(xtr.get('info.url') === 'favicon.ico')
      return xtr.close();

    if(xt.none(r) || r.keys().length <= 0)
      issue(xt.close(
        "Routes were unavailable for the request on server: " +
        "{server}".f({ server: this.get('server.name') || 'UNKNOWN' }), xtr));
    else if(r[xtr.route])
      r[xtr.route].handle(xtr);
    else {
      xtr.write(
        "I can't believe I'm even humoring you with this response, " +
        "you have no idea what you're asking for.");
      issue(xt.close(
        "Unable to handle the route requested, {route}, on server {server}".f(
          { server: this.get('server.name') || 'UNKNOWN', route: xtr.route }), xtr));
    }
  }.by('xtrReady'),

  /**
    This method is called by servers to handle incoming requests.
    It creates a xt response object that in turn emits an event on the
    router to execute the route when it is ready.

    @param {Object} res The server response object.
    @param {Object} req The server request object.

    @method
  */
  handle: function(req, res) {
    var xtr = xt.response.create({
      response: res,
      request: req,
      router: this,
      server: this.get('server')
    });
  },

  /**
    Routes is an array of xt route objects.
  */
  routes: [],

  /**
    A router finds the routes it represents and creates a has it uses
    to lookup paths to the appropriate xt route object upon handling
    a client request.

    @private
  */
  init: function() {
    var r = this.get('routes'),
        n = this.routes = {}; // note the replacement!
    if(xt.none(r) || r.length <= 0) return;
    _.each(r, function(o, k) {

      // grab the routes specified on the xt route object
      // and then map each of those back to the route
      // so when they are encountered they can be explicitly
      // accessed
      var p = o.get('routes');
      if(xt.none(p)) return;
      _.each(p, function(u, k) {
        n[u] = o; // assign unique entries by path => route object
      }, this);
    }, this);
  },

  /** @private */
  className: 'xt.router'
});

xt.router_default = xt.router.create();

xt.mixin(xt.router,
  /** @lends xt.router */ {

  loadRouters: function() {

    xt.log("Loading available routers (from {dir})".f({ dir: 
      xt.fs.shorten(xt.fs.normalize(__dirname + '/../routers'), 5) }));

    // chdir to modules directory for convenient
    // relative pathing
    process.chdir(__dirname);

    // find all of the available files in the routes
    // directory
    xt.fs.directoryFiles('../routers', function(files) {

      var num = files.length;

      // this might should throw a fatal as there really isn't much that
      // can be done when no routes are available
      if(num <= 0)
        return issue(xt.warning("There are no routers available to the server."));

      // iterate over the files and require them so they can be executed
      _.each(files, function(v, k) {
        require('../routers/%@'.f(v));
        --num; if(num == 0) process.emit('xtRoutersLoaded');
      }, this);

    }, 'js');

  }

});
