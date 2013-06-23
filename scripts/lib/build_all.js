/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/

var _ = require('underscore'),
  async = require('async'),
  buildDatabase = require("./build_database").buildDatabase,
  buildClient = require("./build_client").buildClient,
  exec = require('child_process').exec,
  fs = require('fs'),
  path = require('path'),
  pg = require('pg'),
  winston = require('winston');

(function () {
  "use strict";

  var creds;

  //
  // Looks in a database to see which extensions are registered.
  // API conforms to async expectations.
  // Also tacks on the core directory.
  //
  var getRegisteredExtensions = function (database, callback) {
    creds.database = database;
    // TODO: use datasource instead
    var client = new pg.Client(creds);
    client.connect();

    //queries are queued and executed one after another once the connection becomes available
    var result = client.query("SELECT * FROM xt.ext ORDER BY ext_load_order", function (err, res) {
      if (err) {
        // xt.ext probably doesn't exist, because this is probably a brand-new DB.
        // No problem! Give them the core extensions.
        // TODO: we could get these extensions dynamically by looking at the filesystem.
        res = {
          rows: [
            { ext_location: '/core-extensions', ext_name: 'crm' },
            { ext_location: '/core-extensions', ext_name: 'sales' },
            { ext_location: '/core-extensions', ext_name: 'project' }
          ]
        };
      }

      var paths = _.map(res.rows, function (row) {
        var location = row.ext_location,
          name = row.ext_name,
          extPath;

        if (location === '/core-extensions') {
          extPath = path.join(__dirname, "/../../enyo-client/extensions/source/", name);
        } else if (location === '/xtuple-extensions') {
          extPath = path.join(__dirname, "../../../xtuple-extensions/source", name);
        } else if (location === '/private-extensions') {
          extPath = path.join(__dirname, "../../../private-extensions/source", name);
        }
        return extPath;
      }),
        returnObj;

      client.end();

      paths.unshift(path.join(__dirname, "../../enyo-client")); // core path
      paths.unshift(path.join(__dirname, "../../lib/orm")); // lib path
      returnObj = {
        extensions: paths,
        database: database
      };
      callback(null, returnObj);
    });

  };

  exports.build = function (options, callback) {
    var buildSpecs = {},
      databases = [],
      extension,
      backup,
      buildAll = function (specs, creds, buildAllCallback) {
        buildDatabase(specs, creds, function (databaseErr, databaseRes) {
          if (databaseErr) {
            buildAllCallback("Database error. Not bothering to build the client");
            return;
          }
          buildAllCallback(null, "Success!");
          //buildClient(specs, creds, function (clientErr, clientRes) {
          //  if (clientErr) {
          //    console.log("Client build failed");
          //    return;
          //  }
          //  console.log("All is good!");
          //});
        });
      },
      config = require(path.join(__dirname, "../../node-datasource/config.js"));

    creds = config.databaseServer;
    creds.host = creds.hostname; // adapt our lingo to node-postgres lingo
    creds.username = creds.user; // adapt our lingo to orm installer lingo

    if (options.database) {
      // the user has specified a particular database
      // regex: remove trailing slash if present
      databases.push(options.database);
    } else {
      // build all the databases in node-datasource/config.js
      databases = config.datasource.databases;
    }

    if (options.initialize &&
        options.backup &&
        options.database &&
        !options.extension) {
      // Initialize the database. This is serious business, and we only do it if
      // the user does all the arguments correctly. It must be on one database only,
      // with no extensions, with the initialize flag, and with a backup file.

      buildSpecs.database = options.database;
      console.log("options.backup is", options.backup);
      // the backup path is not relative if it starts with a slash
      backup = options.backup.substring(0, 1) === '/' ?
        options.backup :
        path.join(process.cwd(), backup);
      buildSpecs.backup = path.join(backup);
      buildSpecs.initialize = true;
      // TODO: as above, the extensions could be found dynamically
      buildSpecs.extensions = [
        path.join(__dirname, '../../lib/orm'),
        path.join(__dirname, '../../enyo-client'),
        path.join(__dirname, '../../enyo-client/extensions/source/crm'),
        path.join(__dirname, '../../enyo-client/extensions/source/sales'),
        path.join(__dirname, '../../enyo-client/extensions/source/project')
      ];
      buildAll([buildSpecs], creds, callback);

    } else if (options.initialize || options.backup) {
      // The user has not been sufficiently serious.
      callback("If you want to initialize the database, you must specifify " +
        " a database, and use no extensions, and use both the init and the backup flags");

    } else if (options.extension) {
      // extensions are assumed to be specified relative to the cwd
      buildSpecs = _.map(databases, function (database) {
        // the extension is not relative if it starts with a slash
        var extension = options.extension.substring(0, 1) === '/' ?
          options.extension :
          path.join(process.cwd(), options.extension);
        // the user has specified an extension to build
        return {
          database: database,
          extensions: [extension]
        };
      });
      // synchronous...
      buildAll(buildSpecs, creds, callback);

    } else {
      // build all registered extensions for the database
      async.map(databases, getRegisteredExtensions, function (err, results) {
        // asynchronous...
        buildAll(results, creds, callback);
      });
    }
  };

}());

