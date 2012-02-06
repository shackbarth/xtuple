
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
  
  // first thing to do is test to make sure we can communicate with the database
  xt.database.check();  

  // need to load any available routes for routers to be able to do anything
  // with incoming traffic
  xt.route.loadRoutes();

  process.once('xtRoutesLoaded', function() {

    // need to load any available routers for servers to be able to name them
    // explicitly
    xt.router.loadRouters();

    process.once('xtRoutersLoaded', function() {
      xt.server.create({
        name: 'dataServer',
        port: xt.opts['server-port'],
        autoStart: YES,
        router: xt.dataRouter
      });
      
    process.emit('xtBootstrapped');
      
    });
  });

}
