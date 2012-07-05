
//...........................................
// Server Initialization/Setup
//
// Include all of the necessary modules and ensure that
// they will be available throughout the application
// by adding them to the xt namespace.

/** @lends xt */  require('./xt');

require('./runtime/opts');

// set the global mode from the configuration options
XT.mode = XT.opts.datasource.mode || 'development';

// reset the global debugging setting from the configuration options
XT.debugging = XT.opts.datasource.debugging;

// find any of the settings we can for core modules and supply
// the options directly to them (because that is what they
// look for)
Object.keys(XT.opts).forEach(function(moduleName) {
  var module = XT[moduleName];
  var moduleOptions = XT.opts[moduleName];
  if (!module) return;
  Object.keys(moduleOptions).forEach(function(option) {
    module[option] = moduleOptions[option];
  });
});

XT.cache.create();

//XT.cache.createClient(XT.cache.port, XT.cache.hostname);
//XT.Session.poll();

// once bootstrapper is complete the framework is up
// and running and procedures can continue...
  
// load the data server
require('./runtime/dataserver');

// // load the dev user interface server
//require('./runtime/dev');

// load the log user interface
//require('./runtime/log');




//var x = XT.Session.create({username:"admin",password:"admin",organization:"40beta"});
//x.on("isMultiple", function() {
//  var avail = x.get("available");
//  XT.warn("MULTIPLE!!!!!", avail);
//  x.selectSession(0);
//}).on("isReady", function() {
//  XT.warn("READY!!!!");
//  x.query("select * from usr;", function (e, r) {
//    XT.warn("BACK FROM QUERY", e, r);
//  });
//}).on("error", function() {
//  XT.warn("ERROR!!!!!", x.get("error"));
//});


