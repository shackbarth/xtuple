/*jshint node:true, bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

/**
  The XT Node.js framework is comprised of 3 major components. The foundation,
  the database and the server. The foundation can be used on its own. database
  and server can be used with or without the other but both require the foundation.
  
  It is important to note the scoping of the namespace. Unlike most modules that
  do not expose their scope, XT modules and components share the namespace without
  explicitly exporting it. The global variable XT is common to any modules that are
  required after its initial instantiation
  
  It is possible for submodules of the framework to reserve initialization routines
  until after the framework itself has been fully loaded and initialized. There is
  an exposed routine in XT called `run` that expects a single paramter that is a callback
  that will be executed in the order it was received. Currently there is no implementation
  that allows for a module to hook another unless the order of loading is known and
  the first module emits an event that the second module knows to listen for and receive.
  
  There are known limitations in its current implementation in the object hierarchy and
  some of the convenience mechanisms built-in.
*/
  
//.........................................
// Include the foundation that instantiates the
// XT global namespace
require('./foundation');

(function () {
  "use strict";
  
  var _ = XT._;
  
  // the first method to run once the framework has been told it is
  // ready
  XT.run(function () {
    
    if (XT.requireDatabase) require("./database");
    if (XT.requireServer) require("./server");
    
    // special case where the desired output requires calling console directly
    XT.io.console(XT.StringBuffer.create({ color: 'blue', prefix: null }),
      "\n================================================" +
      "\nXTUPLE NODE.JS FRAMEWORK ({version})".f({ version: XT.version }) +
      "\n================================================" +
      "\nThis framework is highly experimental." +
      "\n\nPlease report bugs to the project git issue tracker and for blocking" +
      "\nissues please also report those via email to Cole Davis (cole@xtuple.com)\n"
    );
    
    // give any running process the opportunity to save state
    // or log as gracefully as possible
    process.once('exit', _.bind(XT.cleanup, XT));
    
    process.once('SIGINT', function () {
      XT.io.console(XT.StringBuffer.create({ color: 'blue', prefix: null }),
        "\n================================================" +
        "\nSIGINT CAUGHT - cleaning up before shutting down" +
        "\n================================================"
      );
      process.exit(0);
    });
  });
}());