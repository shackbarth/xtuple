/*jshint node:true, bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

/**
  The X Node.js framework is comprised of 3 major components. The foundation,
  the database and the server. The foundation can be used on its own. database
  and server can be used with or without the other but both require the foundation.
  
  It is important to note the scoping of the namespace. Unlike most modules that
  do not expose their scope, X modules and components share the namespace without
  explicitly exporting it. The global variable X is common to any modules that are
  required after its initial instantiation
  
  It is possible for submodules of the framework to reserve initialization routines
  until after the framework itself has been fully loaded and initialized. There is
  an exposed routine in X called `run` that expects a single paramter that is a callback
  that will be executed in the order it was received. Currently there is no implementation
  that allows for a module to hook another unless the order of loading is known and
  the first module emits an event that the second module knows to listen for and receive.
  
  There are known limitations in its current implementation in the object hierarchy and
  some of the convenience mechanisms built-in.
*/
  
//.........................................
// Include the foundation that instantiates the
// X global namespace
require('./foundation');

(function () {
  "use strict";
  
  var _ = X._, sighandler;
  
  sighandler = function (signal) {
    X.io.console(X.StringBuffer.create({color: "blue", prefix: null}),
      "\n================================================" +
      "\n%@ CAUGHT - cleaning up before shutting down".f(signal.toUpperCase()) +
      "\n================================================"
    );
    X.cleanup();
  };
  
  // the first method to run once the framework has been told it is
  // ready
  X.run(function () {
    
    if (X.requireDatabase) require("./database");
    if (X.requireServer) require("./server");
    if (X.requireCache) {
      require('./database/cache');
      require("./database/ext/mongoose_schema");
    }
    
    // special case where the desired output requires calling console directly
    X.io.console(X.StringBuffer.create({ color: 'blue', prefix: null }),
      "\n================================================" +
      "\nXUPLE NODE.JS FRAMEWORK ({version})".f({ version: X.version }) +
      "\n================================================" +
      "\nThis framework is highly experimental." +
      "\n\nPlease report bugs to the project git issue tracker and for blocking" +
      "\nissues please also report those via email to Cole Davis (cole@xtuple.com)\n"
    );
    
    // give any running process the opportunity to save state
    // or log as gracefully as possible
    //process.once('exit', _.bind(X.cleanup, X));
    
    _.forEach(["SIGINT", "SIGHUP", "SIGQUIT", "SIGKILL", "SIGSEGV", "SIGILL"], function (sig) {
      process.once(sig, _.bind(sighandler, X, sig));
    });
  });
}());
