
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
require('./runtime/dataserver');

// // load the dev user interface server
require('./runtime/dev');

// load the ORM installer interface
require('./runtime/orm');

// load the model generator
require('./runtime/model_generator');

// load the log user interface
require('./runtime/log');

if (XT.opts.builder && XT.opts.builder.useBuilder) {
  require('./runtime/builder');
}
