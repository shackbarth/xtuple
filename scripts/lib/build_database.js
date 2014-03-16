/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/

_ = require('underscore');

var  async = require('async'),
  dataSource = require('../../node-datasource/lib/ext/datasource').dataSource,
  exec = require('child_process').exec,
  fs = require('fs'),
  ormInstaller = require('./orm'),
  dictionaryBuilder = require('./build_dictionary'),
  clientBuilder = require('./build_client'),
  path = require('path'),
  pg = require('pg'),
  os = require('os'),
  winston = require('winston');

(function () {
  "use strict";

  var jsInit = "select xt.js_init();";
  var sendToDatabasePsql = function (query, credsClone, options, callback) {
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
  // Step 0 (optional, triggered by flags), wipe out the database
  // and load it from scratch using pg_restore something.backup unless
  // we're building from source.
  //
  var initDatabase = function (spec, creds, callback) {
    var databaseName = spec.database,
      credsClone = JSON.parse(JSON.stringify(creds));
    // the calls to drop and create the database need to be run against the database "postgres"
    credsClone.database = "postgres";
    winston.info("Dropping database " + databaseName);
    dataSource.query("drop database if exists " + databaseName + ";", credsClone, function (err, res) {
      if (err) {
        winston.error("drop db error", err.message, err.stack, err);
        callback(err);
        return;
      }
      winston.info("Creating database " + databaseName);
      dataSource.query("create database " + databaseName + " template template1;", credsClone, function (err, res) {
        if (err) {
          winston.error("create db error", err.message, err.stack, err);
          callback(err);
          return;
        }
        if (spec.source) {
          // build from source.
          // XXX first draft
          var schemaPath = path.join(path.dirname(spec.source), "440_schema.sql");
          winston.info("Building schema for database " + databaseName);

          exec("psql -U " + creds.username + " -h " + creds.hostname + " --single-transaction -p " +
              creds.port + " -d " + databaseName + " -f " + schemaPath,
              {maxBuffer: 40000 * 1024 /* 200x default */},
              function (err, res) {
            if (err) {
              winston.info("Foundation schema error", err);
              callback("Foundation schema error");
              return;
            }
            winston.info("Populating data for database " + databaseName + " from " + spec.source);
            exec("psql -U " + creds.username + " -h " + creds.hostname + " --single-transaction -p " +
                creds.port + " -d " + databaseName + " -f " + spec.source,
                {maxBuffer: 40000 * 1024 /* 200x default */},
                function (err, stdout, stderr) {
              if (err) {
                winston.info("Foundation data error");
                callback("Foundation data error");
                return;
              }
              winston.info("Foundation database has been built");
              callback(null, res);
            });
          });

          return;
        }

        // use exec to restore the backup. The alternative, reading the backup file into a string to query
        // doesn't work because the backup file is binary.
        winston.info("Restoring database " + databaseName);
        exec("pg_restore -U " + creds.username + " -h " + creds.hostname + " -p " +
            creds.port + " -d " + databaseName + " -j " + os.cpus().length + " " + spec.backup, function (err, res) {
          if (err) {
            console.log("ignoring restore db error", err);
          }
          callback(null, res);
        });
      });
    });
  };


  /**
    @param {Object} specs Specification for the build process, in the form:
      [ { extensions:
           [ '/home/user/git/xtuple/enyo-client',
             '/home/user/git/xtuple/enyo-client/extensions/source/crm',
             '/home/user/git/xtuple/enyo-client/extensions/source/sales',
             '/home/user/git/private-extensions/source/incident_plus' ],
          database: 'dev',
          orms: [] },
        { extensions:
           [ '/home/user/git/xtuple/enyo-client',
             '/home/user/git/xtuple/enyo-client/extensions/source/sales',
             '/home/user/git/xtuple/enyo-client/extensions/source/project' ],
          database: 'dev2',
          orms: [] }]

    @param {Object} creds Database credentials, in the form:
      { hostname: 'localhost',
        port: 5432,
        user: 'admin',
        password: 'admin',
        host: 'localhost' }
  */
  var buildDatabase = exports.buildDatabase = function (specs, creds, masterCallback) {
    if (specs.length === 1 &&
        specs[0].initialize &&
        (specs[0].backup || specs[0].source)) {

      // The user wants to initialize the database first (i.e. Step 0)
      // Do that, then call this function again
      initDatabase(specs[0], creds, function (err, res) {
        if (err) {
          winston.error("Init database error: ", err);
          masterCallback(err);
          return;
        }
        // recurse to do the build step. Of course we don't want to initialize a second
        // time, so destroy those flags.
        specs[0].initialize = false;
        specs[0].wasInitialized = true;
        specs[0].backup = undefined;
        specs[0].source = undefined;
        buildDatabase(specs, creds, masterCallback);
      });
      return;
    }

    //
    // The function to generate all the scripts for a database
    //
    var installDatabase = function (spec, databaseCallback) {
      var extensions = spec.extensions,
        databaseName = spec.database;

      //
      // The function to install all the scripts for an extension
      //
      var getExtensionSql = function (extension, extensionCallback) {
        if (spec.clientOnly) {
          extensionCallback(null, "");
          return;
        }
        //winston.info("Installing extension", databaseName, extension);
        // deal with directory structure quirks
        var isFoundation = extension.indexOf("foundation-database") >= 0,
          isLibOrm = extension.indexOf("lib/orm") >= 0,
          isApplicationCore = extension.indexOf("enyo-client") >= 0 &&
            extension.indexOf("extension") < 0,
          isCoreExtension = extension.indexOf("enyo-client") >= 0 &&
            extension.indexOf("extension") >= 0,
          isPublicExtension = extension.indexOf("xtuple-extensions") >= 0,
          isPrivateExtension = extension.indexOf("private-extensions") >= 0,
          dbSourceRoot = isFoundation ? extension :
            isLibOrm ? path.join(extension, "source") :
            path.join(extension, "database/source"),
          manifestFilename = path.join(dbSourceRoot, "manifest.js");

        //
        // Step 2:
        // Read the manifest files.
        //
        if (!fs.existsSync(manifestFilename)) {
          // error condition: no manifest file
          winston.log("Cannot find manifest " + manifestFilename);
          extensionCallback("Cannot find manifest " + manifestFilename);
          return;
        }
        fs.readFile(manifestFilename, "utf8", function (err, manifestString) {
          var manifest,
            databaseScripts,
            safeToolkit,
            extensionName,
            loadOrder,
            extensionComment,
            extensionLocation,
            isFirstScript = true;

          try {
            manifest = JSON.parse(manifestString);
            extensionName = manifest.name;
            extensionComment = manifest.comment;
            databaseScripts = manifest.databaseScripts;
            loadOrder = manifest.loadOrder || 999;
            if (isCoreExtension) {
              extensionLocation = "/core-extensions";
            } else if (isPublicExtension) {
              extensionLocation = "/xtuple-extensions";
            } else if (isPrivateExtension) {
              extensionLocation = "/private-extensions";
            }

          } catch (error) {
            // error condition: manifest file is not properly formatted
            winston.log("Manifest is not valid JSON" + manifestFilename);
            extensionCallback("Manifest is not valid JSON" + manifestFilename);
            return;
          }

          //
          // Step 2b:
          //
          // Legacy build methodology: if we're making the Qt database build, add the safe
          // toolkit. I can live with the sync in here because it's not a process that's
          // run in production.
          if (isFoundation && extensions.length === 1) {
            safeToolkit = fs.readFileSync(path.join(dbSourceRoot, "safe_toolkit_manifest.js"));
            databaseScripts.unshift(JSON.parse(safeToolkit).databaseScripts);
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
              var beforeNoticeSql = 'do $$ plv8.elog(NOTICE, "About to run file ' + fullFilename + '"); $$ language plv8;\n',
                afterNoticeSql = 'do $$ plv8.elog(NOTICE, "Just ran file ' + fullFilename + '"); $$ language plv8;\n',
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
              if (lastChar !== ';') {
                // error condition: script is improperly formatted
                formattingError = "Error: " + fullFilename + " contents do not end in a semicolon.";
                winston.warn(formattingError);
                scriptCallback(formattingError);
              }

              if (!isFoundation && (!isLibOrm || !isFirstScript)) {
                // to put a noticeSql *before* scriptContents we have to account for the very first
                // script, which is create_plv8, and which must not have any plv8 functions before it,
                // such as a noticeSql.
                scriptContents = beforeNoticeSql + scriptContents;
              }

              isFirstScript = false;

              if (!isFoundation) {
                scriptContents = scriptContents + afterNoticeSql;
              }

              scriptCallback(null, scriptContents);
            });
          };
          async.mapSeries(databaseScripts || [], getScriptSql, function (err, scriptSql) {
            var registerSql,
              dependencies;

            if (err) {
              extensionCallback(err);
              return;
            }
            // each String of the scriptContents is the concatenated SQL for the script.
            // join these all together into a single string for the whole extension.
            var extensionSql = _.reduce(scriptSql, function (memo, script) {
              return memo + script;
            }, "");

            if (!isFoundation && !isLibOrm && !isApplicationCore) {
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
            if (!isFoundation && !isLibOrm) {
              // unless it it hasn't yet been defined (ie. lib/orm),
              // running xt.js_init() is probably a good idea.
              extensionSql = jsInit + extensionSql;
            }

            if (isApplicationCore && spec.wipeViews) {
              // If we want to pre-emptively wipe out the views, the best place to do it
              // is at the start of the core application code
              fs.readFile(path.join(__dirname, "../../enyo-client/database/source/delete_system_orms.sql"),
                  function (err, wipeSql) {
                if (err) {
                  extensionCallback(err);
                  return;
                }
                extensionSql = wipeSql + extensionSql;
                extensionCallback(null, extensionSql);
              });
            } else {
              extensionCallback(null, extensionSql);
            }

          });
          //
          // End script installation code
          //
        });
      };

      // We also need to get the sql that represents the queries to generate
      // the XM views from the ORMs. We use the old ORM installer for this,
      // which has been retooled to return the queryString instead of running
      // it itself.
      var getOrmSql = function (extension, callback) {
        if (spec.clientOnly) {
          callback(null, "");
          return;
        }
        var ormDir = path.join(extension, "database/orm");

        if (fs.existsSync(ormDir)) {
          var updateSpecs = function (err, res) {
            if (err) {
              callback(err);
            }
            // if the orm installer has added any new orms we want to know about them
            // so we can inform the next call to the installer.
            spec.orms = _.unique(_.union(spec.orms, res.orms), function (orm) {
              return orm.namespace + orm.type;
            });
            callback(err, res.query);
          };
          ormInstaller.run(ormDir, spec, updateSpecs);
        } else {
          // No ORM dir? No problem! Nothing to install.
          callback(null, "");
        }
      };

      // We also need to get the sql that represents the queries to put the
      // client source in the database.
      var getClientSql = function (extension, callback) {
        if (spec.databaseOnly) {
          callback(null, "");
          return;
        }
        clientBuilder.getClientSql(extension, callback);
      };

      /**
        The sql for each extension comprises the sql in the the source directory
        with the orm sql tacked on to the end. Note that an alternate methodology
        dictates that *all* source for all extensions should be run before *any*
        orm queries for any extensions, but that is not the way it works here.
       */
      var getAllSql = function (extension, masterCallback) {

        async.series([
          function (callback) {
            getExtensionSql(extension, callback);
          },
          function (callback) {
            if (spec.clientOnly) {
              callback(null, "");
              return;
            }
            dictionaryBuilder.getDictionarySql(extension, callback);
          },
          function (callback) {
            getOrmSql(extension, callback);
          },
          function (callback) {
            getClientSql(extension, callback);
          }
        ], function (err, results) {
          masterCallback(err, _.reduce(results, function (memo, sql) {
            return memo + sql;
          }, ""));
        });
      };


      //
      // Asyncronously run all the functions to all the extension sql for the database,
      // in series, and execute the query when they all have come back.
      //
      async.mapSeries(extensions, getAllSql, function (err, extensionSql) {
        var sendToDatabase,
          allSql,
          credsClone = JSON.parse(JSON.stringify(creds));

        if (err) {
          databaseCallback(err);
          return;
        }
        // each String of the scriptContents is the concatenated SQL for the extension.
        // join these all together into a single string for the whole database.
        allSql = _.reduce(extensionSql, function (memo, script) {
          return memo + script;
        }, "");

        // we delegate to psql
        sendToDatabase = sendToDatabasePsql;

        // Without this, when we delegate to exec psql the err var will not be set even
        // on the case of error.
        allSql = "\\set ON_ERROR_STOP TRUE;\n" + allSql;

        if (spec.wasInitialized) {
          // give the admin user every extension by default
          allSql = allSql + "insert into xt.usrext (usrext_usr_username, usrext_ext_id) " +
            "select '" + creds.username +
            "', ext_id from xt.ext where ext_location = '/core-extensions';";
        }

        winston.info("Applying build to database " + spec.database);
        credsClone.database = spec.database;
        sendToDatabase(allSql, credsClone, spec, function (err, res) {
          databaseCallback(err, res);
        });
      });
    };

    //
    // Step 1:
    // Okay, before we install the database there is ONE thing we need to check,
    // which is the pre-installed ORMs. Check that now.
    //
    var preInstallDatabase = function (spec, callback) {
      var existsSql = "select relname from pg_class where relname = 'orm'",
        credsClone = JSON.parse(JSON.stringify(creds)),
        ormTestSql = "select orm_namespace as namespace, " +
          " orm_type as type " +
          "from xt.orm " +
          "where not orm_ext;";

      credsClone.database = spec.database;

      dataSource.query(existsSql, credsClone, function (err, res) {
        if (err) {
          callback(err);
        }
        if (spec.wipeViews || res.rowCount === 0) {
          // xt.orm doesn't exist, because this is probably a brand-new DB.
          // No problem! That just means that there are no pre-existing ORMs.
          spec.orms = [];
          installDatabase(spec, callback);
        } else {
          dataSource.query(ormTestSql, credsClone, function (err, res) {
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
      winston.info("Success installing all scripts.");
      winston.info("Cleaning up.");
      clientBuilder.cleanup(specs, function (err) {
        if (masterCallback) {
          masterCallback(err, res);
        }
      });
    });
  };


  //
  // Another option: unregister the extension
  //
  exports.unregister = function (specs, creds, masterCallback) {
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

}());
