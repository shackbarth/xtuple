#!/usr/bin/env node

/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/

var fs = require('fs'),
  exec = require('child_process').exec,
  _ = require('underscore');

(function () {
  "use strict";

  var argv, specifiedDir, extensions,
    databases = [],
    buildSpecs = {};

  //
  // Determine which extensions we want to build. If there is no -e flag,
  // then build the core and the core extensions
  //
  argv = process.argv;
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

  if (argv.indexOf("-d") >= 0) {
    // the user has specified a particular database
    // regex: remove trailing slash if present
    databases.push(argv[argv.indexOf("-d") + 1]);
  } else {
    // build all the databases in node-datasource/config.js
    var config = require(__dirname + "/../node-datasource/config.js");
    databases = config.datasource.databases;
  }



  console.log(databases);




  /*
  if (argv.indexOf("-e") >= 0) {
    // the user has specified a particular extension
    // regex: remove trailing slash if present
    specifiedDir = argv[argv.indexOf("-e") + 1].replace(/\/$/, "");
    extensions = [specifiedDir];
  } else {
    // add the core extensions
    // get the core extension directory names
    extensions = fs.readdirSync(coreExtDir);
    // actually we want these with a full path
    extensions = _.map(extensions, function (name) {
      return coreExtDir + name;
    });
  }
*/




}());
