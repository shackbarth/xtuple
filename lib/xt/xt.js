
/** xt.foundation */  require('./foundation');
/** xt.database */    require('./database');
/** xt.server */      require('./server');



// Core modules being included for convenience
xt.util         = require('util');
xt.http         = require('http');
xt.url          = require('url');
xt.crypto       = require('crypto');

xt.async        = require('async');
xt.connect      = require('connect');
xt.request      = require('request');
xt.pg           = require('pg');

xt.watch        = require('watch');
xt.dive         = require('diveSync');

/** 
  A bootstrapper for the server and services once all of the
  third-party modules have been added to the namespace and are
  available as well as the required components of xt in its
  foundation are also loaded and available.

  @lends xt
  @private
*/
xt.bootstrap = function bootstrap() {
  
  // special case where the desired output requires calling console directly
  xt.io.__console__(xt.string.buffer.create({ color: 'blue', prefix: null }),
    "\n================================================" +
    "\nXTUPLE NODE.JS SERVER FRAMEWORK ({version})".f({ version: xt.version }) +
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
    xt.server.create({
      name: 'dataServer',
      port: xt.opts['server-port'],
      autoStart: YES,
      router: xt.dataRouter
    });
    
    // sigh...
    process.emit('xtBootstrapped');
  });
}

process.once('xtReady', xt.bootstrap);
