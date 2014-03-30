/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global _:true */

(function () {
  "use strict";

  var _ = require('underscore'),
    async = require('async'),
    exec = require('child_process').exec,
    fs = require('fs'),
    os = require('os'),
    path = require('path'),
    winston = require('winston'),
    dataSource = require('../../node-datasource/lib/ext/datasource').dataSource;

  var explodeManifest = function (manifestFilename, options, manifestCallback) {
    var dbSourceRoot = path.dirname(manifestFilename);
    //
    // Step 2:
    // Read the manifest files.
    //
    if (!fs.existsSync(manifestFilename)) {
      // error condition: no manifest file
      manifestCallback("Cannot find manifest " + manifestFilename);
      return;
    }
    fs.readFile(manifestFilename, "utf8", function (err, manifestString) {
      var manifest,
        databaseScripts,
        safeToolkit,
        extensionName,
        loadOrder,
        extensionComment,
        extensionLocation;

      try {
        manifest = JSON.parse(manifestString);
        extensionName = manifest.name;
        extensionComment = manifest.comment;
        databaseScripts = manifest.databaseScripts;
        loadOrder = manifest.loadOrder || 999;
        if (options.extensionType === "core") {
          extensionLocation = "/core-extensions";
        } else if (options.extensionType === "public") {
          extensionLocation = "/xtuple-extensions";
        } else if (options.extensionType === "private") {
          extensionLocation = "/private-extensions";
        }

      } catch (error) {
        // error condition: manifest file is not properly formatted
        manifestCallback("Manifest is not valid JSON" + manifestFilename);
        return;
      }

      //
      // Step 2b:
      //
      // Legacy build methodology: if we're making the Qt database build, add the safe
      // toolkit. I can live with the sync in here because it's not a process that's
      // run in production.
      if (options.useSafeFoundationToolkit) {
        safeToolkit = fs.readFileSync(path.join(dbSourceRoot, "safe_toolkit_manifest.js"));
        databaseScripts.unshift(JSON.parse(safeToolkit).databaseScripts);
        databaseScripts = _.flatten(databaseScripts);
      }
      // XXX speculative code FIXME
      // These files are not idempotent and should only be run upon first registration
      if (options.useFoundationScripts) {
        safeToolkit = fs.readFileSync(path.join(dbSourceRoot, "../../foundation-database/manifest.js"));
        var foundationScripts = JSON.parse(safeToolkit).databaseScripts;
        foundationScripts = _.map(foundationScripts, function (path) {
          return "../../foundation-database/" + path;
        });
        databaseScripts.unshift(foundationScripts);
        databaseScripts = _.flatten(databaseScripts);
      }

      //
      // Step 3:
      // Concatenate together all the files referenced in the manifest.
      //
      var getScriptSql = function (filename, scriptCallback) {
        var fullFilename = path.join(dbSourceRoot, filename);
        if (!fs.existsSync(fullFilename)) {
          // error condition: script referenced in manifest.js isn't there
          scriptCallback(path.join(dbSourceRoot, filename) + " does not exist");
          return;
        }
        fs.readFile(fullFilename, "utf8", function (err, scriptContents) {
          // error condition: can't read script
          if (err) {
            scriptCallback(err);
            return;
          }
          var beforeNoticeSql = "do $$ BEGIN RAISE NOTICE 'Loading file " + fullFilename +
            "'; END $$ language plpgsql;\n";

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
          if (scriptContents.charAt(scriptContents.length - 1) !== ';') {
            // error condition: script is improperly formatted
            scriptCallback("Error: " + fullFilename + " contents do not end in a semicolon.");
          }

          scriptCallback(null, beforeNoticeSql + scriptContents);
        });
      };
      async.mapSeries(databaseScripts || [], getScriptSql, function (err, scriptSql) {
        var registerSql,
          dependencies;

        if (err) {
          manifestCallback(err);
          return;
        }
        // each String of the scriptContents is the concatenated SQL for the script.
        // join these all together into a single string for the whole extension.
        var extensionSql = _.reduce(scriptSql, function (memo, script) {
          return memo + script;
        }, "");

        if (options.registerExtension) {
          // register extension and dependencies
          extensionSql = 'do $$ plv8.elog(NOTICE, "About to register extension ' +
            extensionName + '"); $$ language plv8;\n' + extensionSql;
          registerSql = "select xt.register_extension('%@', '%@', '%@', '', %@);\n"
            .f(extensionName, extensionComment, extensionLocation, loadOrder);

          dependencies = manifest.dependencies || [];
          _.each(dependencies, function (dependency) {
            var dependencySql = "select xt.register_extension_dependency('%@', '%@');\n"
              .f(extensionName, dependency);
            extensionSql = dependencySql + extensionSql;
          });
          extensionSql = registerSql + extensionSql;
        }
        if (options.runJsInit) {
          // unless it it hasn't yet been defined (ie. lib/orm),
          // running xt.js_init() is probably a good idea.
          extensionSql = "select xt.js_init();" + extensionSql;
        }

        if (options.wipeViews) {
          // If we want to pre-emptively wipe out the views, the best place to do it
          // is at the start of the core application code
          fs.readFile(path.join(__dirname, "../../enyo-client/database/source/delete_system_orms.sql"),
              function (err, wipeSql) {
            if (err) {
              manifestCallback(err);
              return;
            }
            extensionSql = wipeSql + extensionSql;
            manifestCallback(null, extensionSql);
          });
        } else {
          manifestCallback(null, extensionSql);
        }

      });
      //
      // End script installation code
      //
    });
  };

  //
  // Step 0 (optional, triggered by flags), wipe out the database
  // and load it from scratch using pg_restore something.backup unless
  // we're building from source.
  //
  var initDatabase = function (spec, creds, callback) {
    var databaseName = spec.database,
      credsClone = JSON.parse(JSON.stringify(creds)),
      dropDatabase = function (done) {
        winston.info("Dropping database " + databaseName);
        // the calls to drop and create the database need to be run against the database "postgres"
        credsClone.database = "postgres";
        dataSource.query("drop database if exists " + databaseName + ";", credsClone, done);
      },
      createDatabase = function (done) {
        winston.info("Creating database " + databaseName);
        dataSource.query("create database " + databaseName + " template template1;", credsClone, done);
      },
      buildSchema = function (done) {
        var schemaPath = path.join(path.dirname(spec.source), "440_schema.sql");
        winston.info("Building schema for database " + databaseName);

        exec("psql -U " + creds.username + " -h " + creds.hostname + " --single-transaction -p " +
          creds.port + " -d " + databaseName + " -f " + schemaPath,
          {maxBuffer: 40000 * 1024 /* 200x default */}, done);
      },
      populateData = function (done) {
        winston.info("Populating data for database " + databaseName + " from " + spec.source);
        exec("psql -U " + creds.username + " -h " + creds.hostname + " --single-transaction -p " +
          creds.port + " -d " + databaseName + " -f " + spec.source,
          {maxBuffer: 40000 * 1024 /* 200x default */}, done);
      },
      // use exec to restore the backup. The alternative, reading the backup file into a string to query
      // doesn't work because the backup file is binary.
      restoreBackup = function (done) {
        exec("pg_restore -U " + creds.username + " -h " + creds.hostname + " -p " +
          creds.port + " -d " + databaseName + " -j " + os.cpus().length + " " + spec.backup, function (err, res) {
          if (err) {
            console.log("ignoring restore db error", err);
          }
          callback(null, res);
        });
      },
      finish = function (err, results) {
        if (err) {
          winston.error("init database error", err.message, err.stack, err);
        }
        callback(err, results);
      };

    if (spec.source) {
      async.series([
        dropDatabase,
        createDatabase,
        buildSchema,
        populateData
      ], finish);
    } else {
      async.series([
        dropDatabase,
        createDatabase,
        restoreBackup
      ], finish);
    }
  };


  var sendToDatabase = function (query, credsClone, options, callback) {
    var filename = path.join(__dirname, "temp_query_" + credsClone.database + ".sql");
    fs.writeFile(filename, query, function (err) {
      if (err) {
        winston.error("Cannot write query to file");
        callback(err);
        return;
      }
      var psqlCommand = 'psql -d ' + credsClone.database +
        ' -U ' + credsClone.username +
        ' -h ' + credsClone.hostname +
        ' -p ' + credsClone.port +
        ' -f ' + filename +
        ' --single-transaction';


      /**
       * http://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
       * "maxBuffer specifies the largest amount of data allowed on stdout or
       * stderr - if this value is exceeded then the child process is killed."
       */
      exec(psqlCommand, {maxBuffer: 40000 * 1024 /* 200x default */}, function (err, stdout, stderr) {
        if (err) {
          winston.error("Cannot install file ", filename);
          callback(err);
          return;
        }
        if (options.keepSql) {
          // do not delete the temp query file
          winston.info("SQL file kept as ", filename);
          callback();
        } else {
          fs.unlink(filename, function (err) {
            if (err) {
              winston.error("Cannot delete written query file");
              callback(err);
            }
            callback();
          });
        }
      });
    });
  };

  //
  // Another option: unregister the extension
  //
  var unregister = function (specs, creds, masterCallback) {
    var extension = path.basename(specs[0].extensions[0]),
      unregisterSql = ["delete from xt.usrext where usrext_id in " +
        "(select usrext_id from xt.usrext inner join xt.ext on usrext_ext_id = ext_id where ext_name = $1);",

        "delete from xt.clientcode where clientcode_id in " +
        "(select clientcode_id from xt.clientcode inner join xt.ext on clientcode_ext_id = ext_id where ext_name = $1);",

        "delete from xt.dict where dict_id in " +
        "(select dict_id from xt.dict inner join xt.ext on dict_ext_id = ext_id where ext_name = $1);",

        "delete from xt.extdep where extdep_id in " +
        "(select extdep_id from xt.extdep inner join xt.ext " +
        "on extdep_from_ext_id = ext_id or extdep_to_ext_id = ext_id where ext_name = $1);",

        "delete from xt.ext where ext_name = $1;"];

    if (extension.charAt(extension.length - 1) === "/") {
      // remove trailing slash if present
      extension = extension.substring(0, extension.length - 1);
    }
    winston.info("Unregistering extension:", extension);
    var unregisterEach = function (spec, callback) {
      var options = JSON.parse(JSON.stringify(creds));
      options.database = spec.database;
      options.parameters = [extension];
      var queryEach = function (sql, sqlCallback) {
        dataSource.query(sql, options, sqlCallback);
      };
      async.eachSeries(unregisterSql, queryEach, callback);
    };
    async.each(specs, unregisterEach, masterCallback);
  };

  exports.explodeManifest = explodeManifest;
  exports.initDatabase = initDatabase;
  exports.sendToDatabase = sendToDatabase;
  exports.unregister = unregister;
}());
