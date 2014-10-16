/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global Backbone:true, _:true, XM:true, XT:true*/

var _ = require('underscore'),
  async = require('async'),
  buildDatabase = require("./build_database"),
  buildDictionary = require("./build_dictionary"),
  buildClient = require("./build_client").buildClient,
  defaultExtensions = require("./util/default_extensions").extensions,
  dataSource = require('../../node-datasource/lib/ext/datasource').dataSource,
  exec = require('child_process').exec,
  fs = require('fs'),
  initDatabase = require("./util/init_database").initDatabase,
  inspectDatabaseExtensions = require("./util/inspect_database").inspectDatabaseExtensions,
  npm = require('npm'),
  path = require('path'),
  unregister = require("./util/unregister").unregister,
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

  var buildAll = function (specs, creds, buildAllCallback) {
    async.series([
      function (done) {
        // step 0: init the database, if requested

        if (specs.length === 1 &&
            specs[0].initialize &&
            (specs[0].backup || specs[0].source)) {

          // The user wants to initialize the database first (i.e. Step 0)
          // Do that, then call this function again
          initDatabase(specs[0], creds, function (err, res) {
            specs[0].wasInitialized = true;
            done(err, res);
          });
          return;
        } else {
          done();
        }

      },
      function (done) {
        // step 1: npm install extension if necessary
        // an alternate approach would be only npm install these
        // extensions on an npm install.
        var allExtensions = _.reduce(specs, function (memo, spec) {
          memo.push(spec.extensions);
          return _.flatten(memo);
        }, []);
        var npmExtensions = _.filter(allExtensions, function (extName) {
          return extName && extName.indexOf("node_modules") >= 0;
        });
        if (npmExtensions.length === 0) {
          done();
          return;
        }
        npm.load(function (err, res) {
          if (err) {
            done(err);
            return;
          }
          npm.on("log", function (message) {
            // log the progress of the installation
            console.log(message);
          });
          async.map(npmExtensions, function (extName, next) {
            npm.commands.install([path.basename(extName)], next);
          }, done);
        });
      },
      function (done) {
        // step 2: build the client
        buildClient(specs, done);
      },
      function (done) {
        // step 3: build the database
        buildDatabase.buildDatabase(specs, creds, function (databaseErr, databaseRes) {
          if (databaseErr) {
            buildAllCallback(databaseErr);
            return;
          }
          var returnMessage = "\n";
          _.each(specs, function (spec) {
            returnMessage += "Database: " + spec.database + '\nDirectories:\n';
            _.each(spec.extensions, function (ext) {
              returnMessage += '  ' + ext + '\n';
            });
          });
          done(null, "Build succeeded." + returnMessage);
        });
      },
      function (done) {
        // step 4: import all dictionary files
        if (specs[0].clientOnly || specs[0].databaseOnly) {
          // don't build dictionaries if the user doesn't want us to
          console.log("Not importing the dictionaries");
          return done();
        }
        var databases = _.map(specs, function (spec) {
          return spec.database;
        });
        async.map(databases, buildDictionary.importAllDictionaries, done);
      }
    ], function (err, results) {
      buildAllCallback(err, results && results[results.length - 2]);
    });
  };

  exports.build = function (options, callback) {
    var buildSpecs = {},
      databases = [],
      extension,
      getRegisteredExtensions = function (database, callback) {
        var credsClone = JSON.parse(JSON.stringify(creds));
        credsClone.database = database;
        inspectDatabaseExtensions(credsClone, function (err, paths) {
          callback(null, {
            extensions: paths,
            database: database,
            keepSql: options.keepSql,
            populateData: options.populateData,
            wipeViews: options.wipeViews,
            clientOnly: options.clientOnly,
            databaseOnly: options.databaseOnly
          });
        });
      },
      config;

    if (options.config) {
      config = require(path.resolve(process.cwd(), options.config));
    } else {
      config = require(path.resolve(__dirname, "../../node-datasource/config.js"));
    }
    creds = config.databaseServer;
    creds.encryptionKeyFile = config.datasource.encryptionKeyFile;
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

    } else if (options.backup && options.source) {
      callback("You can build from backup or from source but not both.");

    } else if (options.backup && options.extension) {
      callback("When you're building from a backup you get whatever extensions the backup merits.");

    } else if (options.initialize &&
        (options.backup || options.source) &&
        options.database &&
        (!options.extension || options.extension === 'foundation-database')) {
      // Initialize the database. This is serious business, and we only do it if
      // the user does all the arguments correctly. It must be on one database only,
      // with no extensions, with the initialize flag, and with a backup file.

      buildSpecs.database = options.database;
      if (options.backup) {
        buildSpecs.backup = path.resolve(process.cwd(), options.backup);
        buildSpecs.extensions = false;
        // we'll determine the extensions by looking at the db after restore
      }
      if (options.source) {
        buildSpecs.source = path.resolve(process.cwd(), options.source);
        // if we initialize with the foundation, that means we want
        // an unmobilized build
        buildSpecs.extensions = options.extension ?
          [options.extension] :
          defaultExtensions;
      }
      buildSpecs.initialize = true;
      buildSpecs.keepSql = options.keepSql;
      buildSpecs.populateData = options.populateData;
      buildSpecs.wipeViews = options.wipeViews;
      buildSpecs.clientOnly = options.clientOnly;
      buildSpecs.databaseOnly = options.databaseOnly;
      buildAll([buildSpecs], creds, callback);

    } else if (options.initialize || options.backup || options.source) {
      // The user has not been sufficiently serious.
      callback("If you want to initialize the database, you must specifify " +
        " a database, and use no extensions, and use both the init and either the backup or source flags");

    } else if (options.extension) {
      // the user has specified an extension to build or unregister
      // extensions are assumed to be specified relative to the cwd
      buildSpecs = _.map(databases, function (database) {
        var extension = path.resolve(process.cwd(), options.extension);
        return {
          database: database,
          frozen: options.frozen,
          keepSql: options.keepSql,
          populateData: options.populateData,
          wipeViews: options.wipeViews,
          clientOnly: options.clientOnly,
          databaseOnly: options.databaseOnly,
          extensions: [extension]
        };
      });

      if (options.unregister) {
        unregister(buildSpecs, creds, callback);
      } else {
        // synchronous build
        buildAll(buildSpecs, creds, callback);
      }
    } else {
      // build all registered extensions for the database
      async.map(databases, getRegisteredExtensions, function (err, results) {
        // asynchronous...
        buildAll(results, creds, callback);
      });
    }
  };
}());

