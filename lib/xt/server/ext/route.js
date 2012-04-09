
var _path   = require('path');

/** @namespace
  Routes provide custom handling for specific paths designated as 
  valid requests from clients. They have custom implementations of
  handlers for the generated xt response objects.
*/
XT.Route = XT.Object.extend(
  /** @lends XT.Route.prototype */ {

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

// when the framwork becomes available its imperative that we seek
// and find and require all available routes so the routers can
// use them during initialization
XT.run(function() {
  var files;
  var idx = 0;
  var file;
  var path;

  XT.log("Loading available routes from %@".f(
    XT.shorten(_path.join(__dirname, '../routes'), 5)));

  // change directories to path relatively
  process.chdir(__dirname);

  // collect any available javascript files in the directory
  files = XT.directoryFiles('../routes', 'js');
  
  // require each of them so they are available to any
  // routers that may require them
  for (; idx < files.length; ++idx) {
    file = files[idx];
    path = _path.join('../routes', file);
    require(path);
  }
});
