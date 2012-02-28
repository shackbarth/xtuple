
//...........................................
// Server Initialization/Setup
//
// Include all of the necessary modules and ensure that
// they will be available throughout the application
// by adding them to the xt namespace.

/** @lends xt */  require('./xt');

// once bootstrapper is complete the framework is up
// and running and procedures can continue...
process.once('xtBootstrapped', function() {
  
  // load the ORM installer interface
  require('./xt/runtime/devui');
  require('./xt/runtime/orm');

})
