
//...........................................
// Server Initialization/Setup
//
// Include all of the necessary modules and ensure that
// they will be available throughout the application
// by adding them to the xt namespace.

/** @lends xt */  require('./xt');

// Core modules being included for convenience
xt.util         = require('util');
xt.http         = require('http');
xt.url          = require('url');
xt.crypto       = require('crypto');

xt.async        = require('async');
xt.connect      = require('connect');
xt.request      = require('request');
xt.pg           = require('pg');

// Execute a series of startup routines checking to ensure the
// required tasks are executed correctly.
// process.once('xtReady', xt.bootstrap);

process.once('xtReady', function() {
  
  // first thing to do is test to make sure we can communicate with the database
  xt.database.check();  
  
  
  xt.sessionStore.loadUser('cole', function(e, r) {
    xt.debug(e);
    xt.debug(r);
  });
  

  // // need to load any available routes for routers to be able to do anything
  // // with incoming traffic
  // xt.route.loadRoutes();
  // 
  // process.once('xtRoutesLoaded', function() {
  // 
  //   // need to load any available routers for servers to be able to name them
  //   // explicitly
  //   xt.router.loadRouters();
  // 
  //   process.once('xtRoutersLoaded', function() {
  //     
  //     xt.cache.hmset('testHash', { test1: 'v1', test2: 'v2' });
  //     xt.cache.hgetall('testHash', function(e, r) { xt.debug(r); });
  //     xt.cache.dbsize(function(e,r) { xt.debug('size ', r); });
  //   
  //     
  //   });
  // });
  
});
