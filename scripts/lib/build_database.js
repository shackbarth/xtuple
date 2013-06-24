/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/


var _ = require('underscore'),
  async = require('async'),
  dataSource = require('../../node-datasource/lib/ext/datasource').dataSource,
  exec = require('child_process').exec,
  fs = require('fs'),
  ormInstaller = require('./orm'),
  path = require('path'),
  pg = require('pg'),
  winston = require('winston');

(function () {
  "use strict";

  // TODO: make sure all the extensions work
  // TODO: get rid of all sync functions
  // TODO: get rid of monsterSql
  // TODO: work out logging
  // TODO: comment code
  // TODO: work out test details

  //
  // If requested, we can wipe out the database and load up a fresh
  // one from a backup file.
  //
  var initDatabase = function (spec, creds, callback) {
    var databaseName = spec.database;
    // the calls to drop and create the database need to be run against the database "postgres"
    creds.database = "postgres";
    dataSource.query("drop database if exists " + databaseName + ";", creds, function (err, res) {
      if (err) {
        winston.error("drop db error", err.message, err.stack, err);
        callback(err);
        return;
      }
      dataSource.query("create database " + databaseName + " template template1", creds, function (err, res) {
        if (err) {
          winston.error("create db error", err.message, err.stack, err);
          callback(err);
          return;
        }
        // that's it for calls against the database "postgres"
        creds.database = databaseName;
        // use exec to restore the backup. The alternative, reading the backup file into a string to query
        // isn't working because the backup file is binary.
        exec("pg_restore -U " + creds.username + " -h " + creds.hostname + " -p " +
            creds.port + " -d " + databaseName + " " + spec.backup, function (err, res) {
          if (err) {
            console.log("ignoring restore db error", err);
          }
          callback(null, res);
        });
      });
    });
  };


  /**
    @param {Object} specs look like this:
      [ { extensions:
           [ '/home/user/git/xtuple/enyo-client',
             '/home/user/git/xtuple/enyo-client/extensions/source/crm',
             '/home/user/git/xtuple/enyo-client/extensions/source/sales',
             '/home/user/git/private-extensions/source/incident_plus' ],
          database: 'dev' },
        { extensions:
           [ '/home/user/git/xtuple/enyo-client',
             '/home/user/git/xtuple/enyo-client/extensions/source/sales',
             '/home/user/git/xtuple/enyo-client/extensions/source/project' ],
          database: 'dev2' } ]

    @param {Object} creds look like this:
      { hostname: 'localhost',
        port: 5432,
        user: 'admin',
        password: 'admin',
        host: 'localhost' }
  */
  var buildDatabase = exports.buildDatabase = function (specs, creds, masterCallback) {
    if (specs.length === 1 &&
        specs[0].initialize &&
        specs[0].backup) {
      // the user wants to initialize the database first. Do that, then call this function
      // again

      initDatabase(specs[0], creds, function (err, res) {
        if (err) {
          winston.error("init database error", err);
          masterCallback(err);
          return;
        }
        // recurse to do the build step. Of course we don't want to initialize a second
        // time, so destroy those flags.
        specs[0].initialize = false;
        specs[0].backup = undefined;
        buildDatabase(specs, creds, masterCallback);
      });
      return;
    }

    // TODO: set up winston file transport
    winston.log("Building databases with specs", JSON.stringify(specs));

    //
    // The function to install all extension scripts into a database
    //
    var installDatabase = function (spec, databaseCallback) {
      var extensions = spec.extensions,
        databaseName = spec.database,
        monsterSql = "";

      winston.log("Installing on database", databaseName);

      //
      // The function to install all the extensions of the database
      //
      var installExtension = function (extension, extensionCallback) {
        winston.info("Installing extension", databaseName, extension);
        var isLibOrm = extension.indexOf("lib/orm") >= 0, // TODO: do better
          dbSourceRoot = isLibOrm ?
            path.join(extension, "source") :
            path.join(extension, "database/source"),
          manifestFilename = path.join(dbSourceRoot, "manifest.js"),
          manifestString,
          manifest;

        //
        // Step 1 in installing extension scripts:
        // Read the manifest file
        //
        if (!fs.existsSync(manifestFilename)) {
          winston.log("Cannot find manifest " + manifestFilename);
          extensionCallback("Cannot find manifest " + manifestFilename);
          return;
        }
        manifestString = fs.readFileSync(manifestFilename, "utf8");
        try {
          manifest = JSON.parse(manifestString);
        } catch (error) {
          winston.log("Manifest is not valid JSON" + manifestFilename);
          extensionCallback("Manifest is not valid JSON" + manifestFilename);
          return;
        }

        //
        // Step 2 in installing extension scripts
        // Install all the scripts in the manifest file, in series.
        //
        var installScript = function (filename, scriptCallback) {
          var fullFilename = path.join(dbSourceRoot, filename);
          if (!fs.existsSync(fullFilename)) {
            scriptCallback(path.join(dbSourceRoot, filename) + " does not exist");
            return;
          }
          fs.readFile(fullFilename, "utf8", function (err, scriptContents) {
            var noticeSql = 'do $$ plv8.elog(NOTICE, "Just ran file ' + fullFilename + '"); $$ language plv8;\n',
              formattingError,
              lastChar;

            //
            // Allow inclusion of js files in manifest. If it is a js file,
            // use plv8 to execute it.
            //
            //if (fullFilename.substring(fullFilename.length - 2) === 'js') {
              // this isn't quite working yet
              // http://adpgtech.blogspot.com/2013/03/loading-useful-modules-in-plv8.html
              // put in lib/orm's manifest.js: "../../tools/lib/underscore/underscore-min.js",
            //  scriptContents = "do $$ " + scriptContents + " $$ language plv8;";
            //}

            //
            // Incorrectly-ended sql files (i.e. no semicolon) make for unhelpful error messages
            // when we concatenate 100's of them together. Guard against these.
            //
            scriptContents = scriptContents.trim();
            lastChar = scriptContents.charAt(scriptContents.length - 1);
            if (lastChar !== ';' && lastChar !== '/') { // slash might be the end of a comment; we'll let that slide.
              formattingError = "Error: " + fullFilename + " contents do not end in a semicolon.";
              winston.warn(formattingError);
              scriptCallback(formattingError);
            }

            // can't put noticeSql before scriptContents without accounting for the very first script, which is
            // create_plv8, and which must not have any plv8 functions before it, such as a notice.
            monsterSql += scriptContents += noticeSql;

            scriptCallback(err, scriptContents += noticeSql);
          });
        };
        async.mapSeries(manifest.databaseScripts, installScript, function (err, res) {
          extensionCallback(err, res);
        });
        //
        // End script installation code
        //
      };

      //
      // Run the function to install all the extensions of the database, in series
      //
      async.mapSeries(extensions, installExtension, function (err, scriptContentsArray) {
        // each String of the scriptContentsArray is the concetenated SQL for the extension.
        // join these all together into a single string.
        // TODO: monsterSql is a bit global-variablish for taste.
        //var allSql = _.reduce(scriptContentsArray, function (memo, script) {
        //  return memo + script;
        //}, "");
        //console.log(allSql);
        if (err) {
          databaseCallback(err);
        } else {

          // Now would be an excellent to to generate the orm-install
          // commands for all the extensions on this database.
          var runOrmInstaller = function (extension, callback) {
            var ormDir = path.join(extension, "database/orm");

            if (fs.existsSync(ormDir)) {
              var updateSpecs = function (err, res) {
                if (err) {
                  callback(err);
                }
                monsterSql += res.query;
                // if the orm installer has added any new orms we want to know about them
                // so we can inform the next call to the installer.
                spec.orms = _.unique(_.union(spec.orms, res.orms), function (orm) {
                  return orm.namespace + orm.type;
                });
                callback(err, res);
              };
              ormInstaller.run(creds, ormDir, spec, updateSpecs);
            } else {
              callback(null, "No ORM dir, no problem.");
            }
          };

          async.mapSeries(extensions, runOrmInstaller, function (ormErr, ormRes) {
            if (ormErr) {
              databaseCallback(ormErr);
            } else {
              dataSource.query(monsterSql, creds, function (err, res) {
                databaseCallback(err, res);
              });
            }
          });
        }
      });
    };

    //
    // Okay, before we install the database there is ONE thing we need to check,
    // which is the pre-installed ORMs. Check that now.
    //
    var preInstallDatabase = function (spec, callback) {
      // this is where we do the very important step of putting the db name in the creds
      creds.database = spec.database;
      var existsSql = "select relname from pg_class where relname = 'orm'",
        ormSql = "select orm_namespace as namespace, " +
          " orm_type as type " +
          "from xt.orm " +
          "where not orm_ext;";

      dataSource.query(existsSql, creds, function (err, res) {
        if (err) {
          callback(err);
        }
        if (res.rowCount === 0) {
          // xt.orm probably doesn't exist, because this is probably a brand-new DB.
          // No problem! That just means that there are no pre-existing ORMs.
          spec.orms = [];
          installDatabase(spec, callback);
        } else {
          dataSource.query(ormSql, creds, function (err, res) {
            if (err) {
              callback(err);
            }
            spec.orms = res.rows;
            installDatabase(spec, callback);
          });
        }
      });
    };

    //
    // Install all the databases
    //
    async.map(specs, preInstallDatabase, function (err, res) {
      if (err) {
        winston.error(err.message, err.stack, err);
        if (masterCallback) {
          masterCallback(err);
        }
        return;
      }
      //winston.info("Success installing all scripts");
      if (masterCallback) {
        masterCallback(null, res);
      }
    });
    //
    // End database installation code
    //
  };
}());
