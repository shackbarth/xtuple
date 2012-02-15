
/** XT.foundation */  require('./foundation');
/** XT.database */    require('./database');
/** XT.server */      require('./server');



// Core modules being included for convenience
XT.util         = require('util');
XT.http         = require('http');
XT.url          = require('url');
XT.crypto       = require('crypto');

XT.async        = require('async');
XT.connect      = require('connect');
XT.request      = require('request');
XT.pg           = require('pg');

XT.watch        = require('watch');
XT.dive         = require('diveSync');

/** 
  A bootstrapper for the server and services once all of the
  third-party modules have been added to the namespace and are
  available as well as the required components of xt in its
  foundation are also loaded and available.

  @lends xt
  @private
*/
XT.bootstrap = function bootstrap() {
  
  // special case where the desired output requires calling console directly
  XT.io.__console__(XT.StringBuffer.create({ color: 'blue', prefix: null }),
    "\n================================================" +
    "\nXTUPLE NODE.JS SERVER FRAMEWORK ({version})".f({ version: XT.version }) +
    "\n================================================" +
    "\nThis server is highly experimental - it is an alpha." +
    "\n\nPlease report bugs to the project git issue tracker and for blocking" +
    "\nissues please also report those via email to Cole Davis (cole@xtuple.com)\n"
  );
  
  // let any objects that are waiting know that we are bootstrapping
  process.emit('xtBootstrapping');

  // we can start a server once all of the routers/routes are
  // are loaded and available
  process.once('xtServerReady', function() {
    XT.server.create({
      name: 'dataServer',
      port: XT.opts['server-port'],
      autoStart: YES,
      router: XT.dataRouter
    });
    
    // sigh...
    process.emit('xtBootstrapped');
  });
}

process.once('xtReady', XT.bootstrap);
