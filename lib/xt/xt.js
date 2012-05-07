
/** XT.foundation */  require('./foundation');
/** XT.database */    require('./database');
/** XT.Server */      require('./server');

// special case where the desired output requires calling console directly
XT.io.__console__(XT.StringBuffer.create({ color: 'blue', prefix: null }),
  "\n================================================" +
  "\nXTUPLE NODE.JS SERVER FRAMEWORK ({version})".f({ version: XT.version }) +
  "\n================================================" +
  "\nThis server is highly experimental - it is an alpha." +
  "\n\nPlease report bugs to the project git issue tracker and for blocking" +
  "\nissues please also report those via email to Cole Davis (cole@xtuple.com)\n"
);

/** 
  A bootstrapper for the server and services once all of the
  third-party modules have been added to the namespace and are
  available as well as the required components of xt in its
  foundation are also loaded and available.

  @lends XT
  @private
*/
XT.bootstrap = function bootstrap() {

  // out of the box debugging is false, projects that use
  // the framework can switch this to true
  XT.debugging = false;
}

// once the framework is ready, run our bootstrapper
// which, probably the bootstrapping is done by the
// framework but this is bootstrapping our implementation
XT.run(function() {
  XT.bootstrap();
});

// give any running process the opportunity to save state
// or log as gracefully as possible
process.on('exit', XT.cleanup);

process.on('SIGINT', function() { 
  XT.io.__console__(XT.StringBuffer.create({ color: 'blue', prefix: null }),
    "\n================================================" +
    "\nSIGINT CAUGHT - cleaning up before shutting down" +
    "\n================================================"
  );
  process.exit(0); 
});

// go ahead and start 'er up
XT.didBecomeReady();
