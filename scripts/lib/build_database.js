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

  //
  // There are a few ways we could actually send our query to the database
  //
  var sendToDatabaseAlt = function (query, creds, callback) {
    dataSource.query(query, JSON.parse(JSON.stringify(creds)), callback);
  };

  var sendToDatabase = function (query, creds, callback) {
    var filename = path.join(__dirname, "temp_query.sql");
    fs.writeFile(filename, query, function (err) {
      if (err) {
        winston.error("Cannot write query to file");
        callback(err);
        return;
      }
      var psqlCommand = 'psql -d ' + creds.database +
        ' -U ' + creds.username +
        ' -f ' + filename +
        ' --single-transaction';
      exec(psqlCommand, {maxBuffer: 2000 * 1024 /* 10x default */}, function (err, stdout, stderr) {
        if (err) {
          winston.error("Cannot install file ", filename);
          callback(err);
          return;
        }
        fs.unlink(filename, function (err) {
          if (err) {
            winston.error("Cannot delete written query file");
            callback(err);
          }
          callback();
        });
      });
    });
  };

  //
  // Step 0 (optional, triggered by flags), wipe out the database
  // and load it from scratch using pg_restore something.backup
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
        // doesn't work because the backup file is binary.
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
    @param {Object} specs Specification for the build process, in the form:
      [ { extensions:
           [ '/home/user/git/xtuple/enyo-client',
             '/home/user/git/xtuple/enyo-client/extensions/source/crm',
             '/home/user/git/xtuple/enyo-client/extensions/source/sales',
             '/home/user/git/private-extensions/source/incident_plus' ],
          database: 'dev',
          specs: [] },
        { extensions:
           [ '/home/user/git/xtuple/enyo-client',
             '/home/user/git/xtuple/enyo-client/extensions/source/sales',
             '/home/user/git/xtuple/enyo-client/extensions/source/project' ],
          database: 'dev2',
          specs: [] }]

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
        specs[0].backup) {

      // The user wants to initialize the database first (i.e. Step 0)
      // Do that, then call this function again
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
    // The function to generate all the scripts for a database
    //
    var installDatabase = function (spec, databaseCallback) {
      var extensions = spec.extensions,
        databaseName = spec.database;

      winston.log("Installing on database", databaseName);

      //
      // The function to install all the scripts for an extension
      //
      var getExtensionSql = function (extension, extensionCallback) {
        //winston.info("Installing extension", databaseName, extension);
        // deal with directory structure quirks
        var isLibOrm = extension.indexOf("lib/orm") >= 0,
          dbSourceRoot = isLibOrm ?
            path.join(extension, "source") :
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
          var manifest;
          try {
            manifest = JSON.parse(manifestString);
          } catch (error) {
            // error condition: manifest file is not properly formatted
            winston.log("Manifest is not valid JSON" + manifestFilename);
            extensionCallback("Manifest is not valid JSON" + manifestFilename);
            return;
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
              if (lastChar !== ';') {
                // error condition: script is improperly formatted
                formattingError = "Error: " + fullFilename + " contents do not end in a semicolon.";
                winston.warn(formattingError);
                scriptCallback(formattingError);
              }

              // we can't put noticeSql *before* scriptContents without accounting for the very first
              // script, which is create_plv8, and which must not have any plv8 functions before it,
              // such as a noticeSql.
              scriptCallback(null, scriptContents += noticeSql);
            });
          };
          async.mapSeries(manifest.databaseScripts, getScriptSql, function (err, scriptSql) {
            if (err) {
              extensionCallback(err);
              return;
            }
            // each String of the scriptContents is the concatenated SQL for the script.
            // join these all together into a single string for the whole extension.
            var extensionSql = _.reduce(scriptSql, function (memo, script) {
              return memo + script;
            }, "");
            extensionCallback(null, extensionSql);
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

      /**
        The sql for each extension comprises the sql in the the source directory
        with the orm sql tacked on to the end. Note that an alternate methodology
        dictates that *all* source for all extensions should be run before *any*
        orm queries for any extensions, but that is not the way it works here.
       */
      var getExtensionSqlPlusOrmSql = function (extension, callback) {
        getExtensionSql(extension, function (err, sql) {
          if (err) {
            callback(err);
            return;
          }
          getOrmSql(extension, function (err, ormSql) {
            if (err) {
              callback(err);
              return;
            }
            callback(null, sql + ormSql);
          });
        });
      };


      //
      // Asyncronously run all the functions to all the extension sql for the database,
      // in series, and execute the query when they all have come back.
      //
      async.mapSeries(extensions, getExtensionSqlPlusOrmSql, function (err, extensionSql) {
        if (err) {
          databaseCallback(err);
          return;
        }
        // each String of the scriptContents is the concatenated SQL for the extension.
        // join these all together into a single string for the whole database.
        var allSql = _.reduce(extensionSql, function (memo, script) {
          return memo + script;
        }, "");

        // Without this, when we delegate to exec psql the err var will not be set even
        // on the case of error.
        allSql = "\\set ON_ERROR_STOP TRUE;" + allSql;

        sendToDatabase(allSql, JSON.parse(JSON.stringify(creds)), function (err, res) {
          creds.database = undefined; // safest to strip out the db name once we're done with it
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
      // this is where we do the very important step of putting the db name in the creds
      creds.database = spec.database;
      var existsSql = "select relname from pg_class where relname = 'orm'",
        ormTestSql = "select orm_namespace as namespace, " +
          " orm_type as type " +
          "from xt.orm " +
          "where not orm_ext;";

      dataSource.query(existsSql, JSON.parse(JSON.stringify(creds)), function (err, res) {
        if (err) {
          callback(err);
        }
        if (res.rowCount === 0) {
          // xt.orm doesn't exist, because this is probably a brand-new DB.
          // No problem! That just means that there are no pre-existing ORMs.
          spec.orms = [];
          installDatabase(spec, callback);
        } else {
          dataSource.query(ormTestSql, creds, function (err, res) {
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
  };
}());
