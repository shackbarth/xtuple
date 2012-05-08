
var _path       = require('path');

/** @class
  Functors are special handlers for data requests from the client.
  They are only used by the dataRoute xt route object and are loaded
  automatically at server start.
*/
XT.Functor = XT.Object.extend(
  /** @lends XT.Functor.prototype */ {

  /**
    When loaded by the data route handler it is auto-created
    and thus we want to auto-register to be selectable by
    the route.

    @private
  */
  init: function() {
    XT.functors.push({ handles: this.get('handles'), target: this });
  },

  handle: function(payload, session) {},

  /**
    Each functor handles a specific request type from
    the client. This is a string representing the request
    type that it should be selected when this type is
    encountered by the server.

    @type {String}
    @property
  */
  handles: null,
  
  /**
    Almost all functors should require a session. If they do,
    they will automatically attempt to acquire the session before
    handling the request to ensure they can execute their
    functionality as the correct user. In the rare cases that
    a functor does not require an active session (such as a request
    for a new session) this boolean must be set to false but it
    defaults to true.
    
    @property
    @type Boolean
    @default true
  */
  needsSession: true,

  /** @private */
  className: 'XT.Functor'

});

// make sure to grab and require all of the available functors
XT.run(function() {
  var files;
  var idx = 0;
  var file;
  var path;

  XT.log("Loading available functors from %@".f(
    XT.shorten(_path.join(__dirname, '../functors'), 5)));

  // make sure to create the static container for the functors
  XT.functors = [];

  // change directories to path relatively
  process.chdir(__dirname);

  // collect any available javascript files in the directory
  files = XT.directoryFiles('../functors', 'js');
  
  // require each of them so they are available to any
  // routers that may require them
  for (; idx < files.length; ++idx) {
    file = files[idx];
    path = _path.join('../functors', file);
    require(path);
  }

  // return to the original base directory...ugly things might
  // happen if we don't...its been tried...
  process.chdir(XT.basePath);
});
