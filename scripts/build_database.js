#!/usr/bin/env node

/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/

var fs = require('fs'),
  exec = require('child_process').exec,
  _ = require('underscore'),
  pg = require('pg'),
  async = require('async'),
  config = require(__dirname + "/../node-datasource/config.js");

(function () {
  "use strict";

  var argv = process.argv,
    specifiedExtension,
    creds = config.databaseServer,
    databases = [],
    buildSpecs = {};

  // adapt our lingo to node-postgres lingo
  creds.host = creds.hostname;

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
  // Do all the work
  //
  var buildDatabase = function (specs) {
    console.log(specs);
    // TODO
  };

  //
  // The arg parser returns the spec as an array of objects with one key each.
  // This is awkward. We want the specs to be an object whose keys are the
  // databases and whose values are arrays of paths.
  //
  var flattenSpecs = function (specs) {
    var obj = {};

    _.each(specs, function (spec) {
      var keys = Object.keys(spec);
      _.each(keys, function (key) {
        obj[key] = spec[key];
      });
    });
    return obj;
  };


  //
  // Looks in a database to see which extensions are registered.
  // API conforms to async expectations.
  // Also tacks on the core directory.
  //
  var getRegisteredExtensions = function (database, callback) {
    creds.database = database;
    var client = new pg.Client(creds);
    client.connect();

    //queries are queued and executed one after another once the connection becomes available
    var result = client.query("SELECT * FROM xt.ext ORDER BY ext_load_order", function (err, res) {
      var paths = _.map(res.rows, function (row) {
        var location = row.ext_location,
          name = row.ext_name,
          path;

        if (location === '/core-extensions') {
          path = __dirname + "/../enyo-client/extensions/source/" + name;
        } else if (location === '/xtuple-extensions') {
          path = __dirname + "/../../xtuple-extensions/source/" + name;
        } else if (location === '/private-extensions') {
          path = __dirname + "/../../private-extensions/source/" + name;
        }
        return path;
      }),
        corePath = __dirname + "/../enyo-client",
        returnObj = {};

      client.end();

      paths.unshift(corePath);
      returnObj[database] = paths;
      callback(null, returnObj);
    });

  };

  //
  // Parse optional database argument
  //
  if (argv.indexOf("-d") >= 0) {
    // the user has specified a particular database
    // regex: remove trailing slash if present
    databases.push(argv[argv.indexOf("-d") + 1]);
  } else {
    // build all the databases in node-datasource/config.js
    databases = config.datasource.databases;
  }

  //
  // Parse optional extension argument
  // and call buildDatabase
  //
  if (argv.indexOf("-e") >= 0) {
    // the user has specified a particular extension
    // regex: remove trailing slash if present
    specifiedExtension = argv[argv.indexOf("-e") + 1].replace(/\/$/, "");
    buildSpecs = _.map(databases, function (database) {
      // the user has specified an extension to build
      var returnObj = {};
      returnObj[database] = [specifiedExtension];
      return returnObj;
    });
    // synchronous...
    buildDatabase(flattenSpecs(buildSpecs));

  } else {
    // build all registered extensions for the database
    async.map(databases, getRegisteredExtensions, function (err, results) {
      // asynchronous...
      buildDatabase(flattenSpecs(results));
    });
  }

}());
