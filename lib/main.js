
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
process.once('xtReady', xt.bootstrap);
