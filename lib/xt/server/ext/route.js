
/** @namespace
  Routes provide custom handling for specific paths designated as 
  valid requests from clients. They have custom implementations of
  handlers for the generated xt response objects.
*/
xt.route = xt.object.extend(
  /** @lends xt.route.prototype */ {

  /**
    If a router matches a requested path to this route it will call this
    method on the route and pass it the generated xt response object. Routes
    have custom implementations depending on their purpose so the request
    should be specific to the type of route handler.

    @param {Object} xtr The xt response object.
    
    @method
  */
  handle: function(xtr) {},

  /**
    Routes have a list of the paths they handle. For now the paths are
    hard-coded for efficient matching but can/should be extended in the
    future to be more versatile.

    @property
  */
  routes: [],

});

xt.mixin(xt.route,
  /** @lends xt.route */ {

  loadRoutes: function() {

    xt.log("Loading available routes (from {dir})".f({ dir: 
      xt.fs.shorten(xt.fs.normalize(__dirname + '/../routes'), 5) }));

    // chdir to modules directory for convenient
    // relative pathing
    process.chdir(__dirname);

    // find all of the available files in the routes
    // directory
    xt.fs.directoryFiles('../routes', function(files) {

      var num = files.length;

      // this might should throw a fatal as there really isn't much that
      // can be done when no routes are available
      if(num <= 0)
        return issue(xt.warning("There are no routes available to the server."));

      // iterate over the files and require them so they can be executed
      _.each(files, function(v, k) {
        require('../routes/%@'.f(v));
        --num; if(num == 0) process.emit('xtRoutesLoaded');
      }, this);

    }, 'js');

  }

});
