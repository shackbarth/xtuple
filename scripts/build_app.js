#!/usr/bin/env node

/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/


//
// This file really just parses the arguments, and sends the real work
// off to lib/build.js.
//

(function () {
  "use strict";

  var argv = process.argv,
    build = require("./lib/build").build,
    specifiedDatabase,
    specifiedExtension;

  //
  // Help documentation
  //
  if (argv.indexOf("-h") >= 0) {
    console.log("Usage:");
    console.log("sudo ./build_database.js");
    console.log("  will build the core and all registered extensions against all databases in config.js");
    console.log("sudo ./build_database.js -e path/to/ext");
    console.log("  will register and build the extension at that path against all databases in config.js");
    console.log("  e.g. sudo ./build_database -e ../../private-extensions/source/ppm");
    console.log("sudo ./build_database.js -d database_name");
    console.log("  will build the core and all registered extensions against specified database");
    console.log("sudo ./build_database.js -d database_name -e path/to/ext");
    console.log("  will register and build the extension at that path against specified database");
    return;
  }


  //
  // Parse optional database argument
  //
  if (argv.indexOf("-d") >= 0) {
    // the user has specified a particular database
    // regex: remove trailing slash if present
    specifiedDatabase = argv[argv.indexOf("-d") + 1];
  }

  //
  // Parse optional extension argument
  // and call buildDatabase
  //
  if (argv.indexOf("-e") >= 0) {
    // the user has specified a particular extension
    // regex: remove trailing slash if present
    specifiedExtension = argv[argv.indexOf("-e") + 1].replace(/\/$/, "");
  }

  build(specifiedDatabase, specifiedExtension);

}());
