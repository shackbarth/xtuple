
//...........................................
// Server Initialization/Setup
//
// Include all of the necessary modules and ensure that
// they will be available throughout the application
// by adding them to the xt namespace.

/** @lends xt */  require('./xt');

// Execute a series of startup routines checking to ensure the
// required tasks are executed correctly.
process.once('xtReady', xt.bootstrap);