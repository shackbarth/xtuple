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
    dataSource = require('../../node-datasource/lib/ext/datasource').dataSource,
    winston = require('winston');




  var convertFromMetasql = function (content, filename, defaultSchema) {
    var lines = content.split("\n"),
      schema = defaultSchema ? "'" + defaultSchema + "'" : "NULL",
      group,
      i = 2,
      name,
      notes = "",
      grade = 0,
      deleteSql,
      insertSql;

    if (lines[0].indexOf("-- Group: ") !== 0 ||
        lines[1].indexOf("-- Name: ") !== 0 ||
        lines[2].indexOf("-- Notes:") !== 0) {
      throw new Error("Improperly formatted metasql: " + filename);
    }
    group = lines[0].substring("-- Group: ".length).trim();
    name = lines[1].substring("-- Name: ".length).trim();
    while (lines[i].indexOf("--") === 0) {
      notes = notes + lines[i].substring(2) + "\n";
      i++;
    }
    notes = notes.substring(" Notes:".length);
    if (notes.indexOf("must be grade 10") >= 0) {
      grade = 10;
    }

    insertSql = "select saveMetasql (" +
      "'" + group + "'," +
      "'" + name + "'," +
      "$$" + notes + "$$," +
      "$$" + content + "$$," +
      "true, " + schema + ", " + grade + ");";

    return insertSql;
  };

  var convertFromReport = function (content, filename, defaultSchema) {
    var lines = content.split("\n"),
      name,
      grade = "0",
      tableName = defaultSchema ? defaultSchema + ".pkgreport" : "report",
      description,
      disableSql,
      deleteSql,
      insertSql,
      enableSql;

    if (lines[3].indexOf(" <name>") !== 0 ||
        lines[4].indexOf(" <description>") !== 0) {
      throw new Error("Improperly formatted report");
    }
    name = lines[3].substring(" <name>".length).trim();
    name = name.substring(0, name.indexOf("<"));
    description = lines[4].substring(" <description>".length).trim();
    description = description.substring(0, description.indexOf("<"));
    if (lines[5].indexOf("grade") >= 0) {
      grade = lines[5].substring(" <grade>".length).trim();
      grade = grade.substring(0, grade.indexOf("<"));
    }

    disableSql = "ALTER TABLE " + tableName + " DISABLE TRIGGER ALL;";

    deleteSql = "delete from " + tableName + " " +
      "where report_name = '" + name +
      "' and report_grade = " + grade + ";";

    insertSql = "insert into " + tableName + " (report_name, report_descrip, " +
      "report_source, report_loaddate, report_grade) VALUES (" +
      "'" + name + "'," +
      "$$" + description + "$$," +
      "$$" + content + "$$," +
      "now(), " + grade + ");";

    enableSql = "ALTER TABLE " + tableName + " ENABLE TRIGGER ALL;";

    return disableSql + deleteSql + insertSql + enableSql;
  };

  var convertFromScript = function (content, filename, defaultSchema) {
    var name = path.basename(filename, '.js'),
      tableName = defaultSchema ? defaultSchema + ".pkgscript" : "unknown",
      notes = "", //"xtMfg package",
      disableSql,
      deleteSql,
      insertSql,
      enableSql;

    disableSql = "ALTER TABLE " + tableName + " DISABLE TRIGGER ALL;";

    deleteSql = "delete from " + tableName + " " +
      "where script_name = '" + name +
      "';";

    insertSql = "insert into " + tableName + " (script_name, script_order, script_enabled, " +
      "script_source, script_notes) VALUES (" +
      "'" + name + "', 0, TRUE, " +
      "$$" + content + "$$," +
      "'" + notes + "');";

    enableSql = "ALTER TABLE " + tableName + " ENABLE TRIGGER ALL;";

    return disableSql + deleteSql + insertSql + enableSql;
  };

  var convertFromUiform = function (content, filename, defaultSchema) {
    var name = path.basename(filename, '.ui'),
      tableName = defaultSchema ? defaultSchema + ".pkguiform" : "unknown",
      notes = "", //"xtMfg package",
      disableSql,
      deleteSql,
      insertSql,
      enableSql;

    disableSql = "ALTER TABLE " + tableName + " DISABLE TRIGGER ALL;";

    deleteSql = "delete from " + tableName + " " +
      "where uiform_name = '" + name +
      "';";

    insertSql = "insert into " + tableName + " (uiform_name, uiform_order, uiform_enabled, " +
      "uiform_source, uiform_notes) VALUES (" +
      "'" + name + "', 0, TRUE, " +
      "$$" + content + "$$," +
      "'" + notes + "');";

    enableSql = "ALTER TABLE " + tableName + " ENABLE TRIGGER ALL;";

    return disableSql + deleteSql + insertSql + enableSql;
  };

  var conversionMap = {
    mql: convertFromMetasql,
    xml: convertFromReport,
    js: convertFromScript,
    ui: convertFromUiform,
    sql: function (content) {
      // no op
      return content;
    }
  };

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
        extraManifestPath,
        defaultSchema,
        extraManifest,
        extraManifestScripts,
        alterPaths = dbSourceRoot.indexOf("foundation-database") < 0,
        extensionName,
        loadOrder,
        extensionComment;

      try {
        manifest = JSON.parse(manifestString);
        extensionName = manifest.name;
        extensionComment = manifest.comment;
        databaseScripts = manifest.databaseScripts;
        defaultSchema = manifest.defaultSchema;
        loadOrder = manifest.loadOrder || 999;

      } catch (error) {
        // error condition: manifest file is not properly formatted
        manifestCallback("Manifest is not valid JSON" + manifestFilename);
        return;
      }

      //
      // Step 2b:
      //

      // supported use cases:

      // 1. add mobilized inventory to quickbooks
      // need the frozen_manifest, the foundation/manifest, and the mobile manifest
      // -e ../private-extensions/source/inventory -f
      // useFrozenScripts, useFoundationScripts

      // 2. add mobilized inventory to masterref (foundation inventory is already there)
      // need the the foundation/manifest and the mobile manifest
      // -e ../private-extensions/source/inventory
      // useFoundationScripts

      // 3. add unmobilized inventory to quickbooks
      // need the frozen_manifest and the foundation/manifest
      // -e ../private-extensions/source/inventory/foundation-database -f
      // useFrozenScripts (useFoundationScripts already taken care of by -e path)

      // 4. upgrade unmobilized inventory
      // not sure if this is necessary, but it would look like
      // -e ../private-extensions/source/inventory/foundation-database

      if (options.useFoundationScripts) {
        extraManifest = JSON.parse(fs.readFileSync(path.join(dbSourceRoot, "../../foundation-database/manifest.js")));
        defaultSchema = defaultSchema || extraManifest.defaultSchema;
        extraManifestScripts = extraManifest.databaseScripts;
        extraManifestScripts = _.map(extraManifestScripts, function (path) {
          return "../../foundation-database/" + path;
        });
        databaseScripts.unshift(extraManifestScripts);
        databaseScripts = _.flatten(databaseScripts);
      }
      if (options.useFrozenScripts) {
        // Frozen files are not idempotent and should only be run upon first registration
        extraManifestPath = alterPaths ?
         path.join(dbSourceRoot, "../../foundation-database/frozen_manifest.js") :
         path.join(dbSourceRoot, "frozen_manifest.js");

        extraManifest = JSON.parse(fs.readFileSync(extraManifestPath));
        defaultSchema = defaultSchema || extraManifest.defaultSchema;
        extraManifestScripts = extraManifest.databaseScripts;
        if (alterPaths) {
          extraManifestScripts = _.map(extraManifestScripts, function (path) {
            return "../../foundation-database/" + path;
          });
        }
        databaseScripts.unshift(extraManifestScripts);
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
          var beforeNoticeSql = "do $$ BEGIN RAISE NOTICE 'Loading file " + path.basename(fullFilename) +
              "'; END $$ language plpgsql;\n",
            extname = path.extname(fullFilename).substring(1);

          // convert special files: metasql, uiforms, reports, uijs
          scriptContents = conversionMap[extname](scriptContents, fullFilename, defaultSchema);
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

          scriptCallback(null, '\n' + scriptContents);
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
            .f(extensionName, extensionComment, options.extensionLocation, loadOrder);

          var grantExtToAdmin = "select xt.grant_role_ext('ADMIN', '%@');\n"
            .f(extensionName);

          extensionSql = grantExtToAdmin + extensionSql;

          dependencies = manifest.dependencies || [];
          _.each(dependencies, function (dependency) {
            var dependencySql = "select xt.register_extension_dependency('%@', '%@');\n"
                .f(extensionName, dependency),
              grantDependToAdmin = "select xt.grant_role_ext('ADMIN', '%@');\n"
                .f(dependency);

            extensionSql = dependencySql + grantDependToAdmin + extensionSql;
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
