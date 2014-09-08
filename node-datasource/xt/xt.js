/*jshint node:true, bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XT:true */

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
XT = { };

(function () {
  "use strict";

  var _ = X._, _path = X.path, sighandler;

  sighandler = function (signal) {

    // mostly for logging, make sure anything that wants to know can
    // easily find why we're shutting down
    X.SHUTDOWN_SIGNAL = signal;
    X.io.console(X.StringBuffer.create({color: "blue", prefix: null}),
      "\n================================================" +
      "\n%@ CAUGHT - cleaning up before shutting down".f(signal.toUpperCase()) +
      "\n================================================"
    );
    // this is a workaround. We want to be able to dictate the exit code. As a convention
    // we'll say that SIGKILL is the error exit code of 1 and all the rest are the normal
    // error code of 0
    X.cleanup(signal === 'SIGKILL');
  };

  // the first method to run once the framework has been told it is
  // ready
  X.run(function () {

    var i, sub;

    // special case where the desired output requires calling console directly
    X.io.console(X.StringBuffer.create({ color: 'blue', prefix: null }),
      "\n================================================" +
      "\nXTUPLE NODE.JS SERVER" +
      "\n================================================\n"
    );

    require("./database");

    X.pid = process.pid;

    // must explicitly be set to false for it to know you do not want
    // a pidfile!
    if (X.pidFile !== false) {
      if (!X.pidFilePath) {
        X.pidFilePath = "%@/pid".f(X.basePath);
      } else if (X.pidFilePath.indexOf(X.basePath) === -1) {
        X.pidFilePath = _path.join(X.basePath, X.pidFilePath);
      }
      if (!X.pidFileName) {
        X.pidFileName = "%@.pid".f(X.options.processName ? X.options.processName: "node_xt_process");
      } else if (X.pidFileName.indexOf(".pid") === -1) {
        X.pidFileName = X.pidFileName.suf(".pid");
      }

      // if we're allowed to have multiples of this resource executing
      // simultaneously we need to make the name unique
      if (X.options.allowMultipleInstances === true) {
        i = X.pidFileName.indexOf(".pid");
        sub = X.pidFileName.substring(0, i);
        X.pidFileName = "%@_%@.pid".f(sub, X.pid);
      }

      // keep track of the actual pidfile full path
      X.pidFile = _path.join(X.pidFilePath, X.pidFileName);

      X.exists(X.pidFile, function (exists) {
        if (exists && !X.options.allowMultipleInstances) {
          X.error("Multiple instances are not allowed");
        } else {

          // write our pidfile...
          X.exists(_path.join(X.pidFilePath), function (exists) {
            if (!exists) {
              X.createDir(X.pidFilePath, X.writePidFile);
            }
            else {
              X.writePidFile();
            }
          });
        }
      });
    }

    // give any running process the opportunity to save state
    // or log as gracefully as possible
    process.once('exit', _.bind(X.cleanup, X));
  });
}());
