
//...........................................
// Server Initialization/Setup
//
// Include all of the necessary modules and ensure that
// they will be available throughout the application
// by adding them to the xt namespace.

/** @lends xt */  require('./xt');

// once bootstrapper is complete the framework is up
// and running and procedures can continue...
  
// load the data server
require('./xt/runtime/dataserver');

// // load the devUI server
require('./xt/runtime/devui');

// // load the ORM installer interface
require('./xt/runtime/orm');

// // load the model generator
require('./xt/runtime/model_generator');

// // load the client server/build tools
require('./xt/runtime/builder');

// // load the log user interface
require('./xt/runtime/logui');
