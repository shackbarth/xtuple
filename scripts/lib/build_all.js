/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/

var _ = require('underscore'),
  async = require('async'),
  buildDatabase = require("./build_database").buildDatabase,
  buildClient = require("./build_client").buildClient,
  dataSource = require('../../node-datasource/lib/ext/datasource').dataSource,
  exec = require('child_process').exec,
  fs = require('fs'),
  path = require('path'),
  winston = require('winston');

/*
  This is the point of entry for both the lightweight CLI entry-point and
  programmatic calls to build, such as from mocha. Most of the work in this
  file is in determining what the defaults mean. For example, if the
  user does not specify an extension, we install the core and all registered
  extensions, which requires a call to xt.ext.

  We delegate the work of actually building the database and building the
  client to build_database.js and build_client.js.
*/

(function () {
  "use strict";

  var creds;


  exports.build = function (options, callback) {
    var buildSpecs = {},
      databases = [],
      extension,
      //
      // Looks in a database to see which extensions are registered, and
      // tacks onto that list the core directories.
      //
      getRegisteredExtensions = function (database, callback) {
        var result,
          credsClone = JSON.parse(JSON.stringify(creds)),
          existsSql = "select relname from pg_class where relname = 'ext'",
          extSql = "SELECT * FROM xt.ext ORDER BY ext_load_order",
          // TODO: we could get these extensions dynamically by looking at the filesystem.
          defaultExtensions = [
            { ext_location: '/core-extensions', ext_name: 'crm' },
            { ext_location: '/core-extensions', ext_name: 'inventory' },
            { ext_location: '/core-extensions', ext_name: 'project' },
            { ext_location: '/core-extensions', ext_name: 'sales' }
          ],
          adaptExtensions = function (err, res) {
            if (err) {
              callback(err);
              return;
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
            });

            paths.unshift(path.join(__dirname, "../../enyo-client")); // core path
            paths.unshift(path.join(__dirname, "../../lib/orm")); // lib path
            callback(null, {
              extensions: paths,
              database: database,
              wipeViews: options.wipeViews,
              clientOnly: options.clientOnly,
              databaseOnly: options.databaseOnly,
              queryDirect: options.queryDirect
            });
          };

        credsClone.database = database;
        dataSource.query(existsSql, credsClone, function (err, res) {
          if (err) {
            callback(err);
            return;
          }
          if (res.rowCount === 0) {
            // xt.ext doesn't exist, because this is probably a brand-new DB.
            // No problem! Give them the core extensions.
            adaptExtensions(null, { rows: defaultExtensions });
          } else {
            dataSource.query(extSql, credsClone, adaptExtensions);
          }
        });
      },
      buildAll = function (specs, creds, buildAllCallback) {
        buildClient(specs, function (err, res) {
          if (err) {
            buildAllCallback(err);
            return;
          }
          buildDatabase(specs, creds, function (databaseErr, databaseRes) {
            var returnMessage;
            if (databaseErr && specs[0].wipeViews) {
              buildAllCallback(databaseErr);
              return;

            } else if (databaseErr) {
              buildAllCallback("Build failed. Try wiping the views next time by running me with the -w flag.");
              return;
            }
            returnMessage = "\n";
            _.each(specs, function (spec) {
              returnMessage += "Database: " + spec.database + '\nDirectories:\n';
              _.each(spec.extensions, function (ext) {
                returnMessage += '  ' + ext + '\n';
              });
            });
            buildAllCallback(null, "Build succeeded." + returnMessage);
          });
        });
      },
      config;

    if (options.config) {
      config = require(path.join(process.cwd(), options.config));
    } else {
      config = require(path.join(__dirname, "../../node-datasource/config.js"));
    }
    creds = config.databaseServer;
    creds.host = creds.hostname; // adapt our lingo to node-postgres lingo
    creds.username = creds.user; // adapt our lingo to orm installer lingo

    if (options.database) {
      // the user has specified a particular database
      databases.push(options.database);
    } else {
      // build all the databases in node-datasource/config.js
      databases = config.datasource.databases;
    }

    if (options.clientOnly && options.databaseOnly) {
      // This request doesn't make any sense.
      callback("Make up your mind.");

    } else if (options.wipeViews && options.extension) {
      // Drop-all-views is only supported for a whole-db install.
      callback("View dropping is only supported while installing the whole database.");

    } else if (options.initialize &&
        options.backup &&
        options.database &&
        !options.extension) {
      // Initialize the database. This is serious business, and we only do it if
      // the user does all the arguments correctly. It must be on one database only,
      // with no extensions, with the initialize flag, and with a backup file.

      buildSpecs.database = options.database;
      // the backup path is not relative if it starts with a slash
      buildSpecs.backup = options.backup.substring(0, 1) === '/' ?
        options.backup :
        path.join(process.cwd(), options.backup);
      buildSpecs.initialize = true;
      buildSpecs.wipeViews = options.wipeViews;
      buildSpecs.clientOnly = options.clientOnly;
      buildSpecs.databaseOnly = options.databaseOnly;
      buildSpecs.queryDirect = options.queryDirect;
      // TODO: as above, the extensions could be found dynamically
      buildSpecs.extensions = [
        path.join(__dirname, '../../lib/orm'),
        path.join(__dirname, '../../enyo-client'),
        path.join(__dirname, '../../enyo-client/extensions/source/crm'),
        path.join(__dirname, '../../enyo-client/extensions/source/inventory'),
        path.join(__dirname, '../../enyo-client/extensions/source/project'),
        path.join(__dirname, '../../enyo-client/extensions/source/sales')
      ];
      buildAll([buildSpecs], creds, callback);

    } else if (options.initialize || options.backup) {
      // The user has not been sufficiently serious.
      callback("If you want to initialize the database, you must specifify " +
        " a database, and use no extensions, and use both the init and the backup flags");

    } else if (options.extension) {
      // the user has specified an extension to build
      // extensions are assumed to be specified relative to the cwd
      buildSpecs = _.map(databases, function (database) {
        // the extension is not relative if it starts with a slash
        var extension = options.extension.substring(0, 1) === '/' ?
          options.extension :
          path.join(process.cwd(), options.extension);
        return {
          database: database,
          wipeViews: options.wipeViews,
          clientOnly: options.clientOnly,
          databaseOnly: options.databaseOnly,
          queryDirect: options.queryDirect,
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

