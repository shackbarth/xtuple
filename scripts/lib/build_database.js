/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/

_ = require('underscore');

var  async = require('async'),
  dataSource = require('../../node-datasource/lib/ext/datasource').dataSource,
  exec = require('child_process').exec,
  explodeManifest = require("./util/process_manifest").explodeManifest,
  fs = require('fs'),
  ormInstaller = require('./orm'),
  dictionaryBuilder = require('./build_dictionary'),
  clientBuilder = require('./build_client'),
  path = require('path'),
  pg = require('pg'),
  os = require('os'),
  sendToDatabase = require("./util/send_to_database").sendToDatabase,
  winston = require('winston');

(function () {
  "use strict";

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
        // deal with directory structure quirks
        var baseName = path.basename(extension),
          isFoundation = extension.indexOf("foundation-database") >= 0,
          isFoundationExtension = extension.indexOf("inventory/foundation-database") >= 0 ||
            extension.indexOf("manufacturing/foundation-database") >= 0 ||
            extension.indexOf("distribution/foundation-database") >= 0,
          isLibOrm = extension.indexOf("lib/orm") >= 0,
          isApplicationCore = extension.indexOf("enyo-client") >= 0 &&
            extension.indexOf("extension") < 0,
          isCoreExtension = extension.indexOf("enyo-client") >= 0 &&
            extension.indexOf("extension") >= 0,
          isPublicExtension = extension.indexOf("xtuple-extensions") >= 0,
          isPrivateExtension = extension.indexOf("private-extensions") >= 0,
          isNpmExtension = baseName.indexOf("xtuple-") >= 0,
          isExtension = !isFoundation && !isLibOrm && !isApplicationCore,
          dbSourceRoot = (isFoundation || isFoundationExtension) ? extension :
            isLibOrm ? path.join(extension, "source") :
            path.join(extension, "database/source"),
          manifestOptions = {
            manifestFilename: path.resolve(dbSourceRoot, "manifest.js"),
            extensionPath: isExtension ?
              path.resolve(dbSourceRoot, "../../") :
              undefined,
            useFrozenScripts: spec.frozen,
            useFoundationScripts: baseName.indexOf('inventory') >= 0 ||
              baseName.indexOf('manufacturing') >= 0 ||
              baseName.indexOf('distribution') >= 0,
            registerExtension: isExtension,
            runJsInit: !isFoundation && !isLibOrm,
            wipeViews: isFoundation && spec.wipeViews,
            wipeOrms: isApplicationCore && spec.wipeViews,
            extensionLocation: isCoreExtension ? "/core-extensions" :
              isPublicExtension ? "/xtuple-extensions" :
              isPrivateExtension ? "/private-extensions" :
              isNpmExtension ? "npm" : "not-applicable"
          };

        explodeManifest(manifestOptions, extensionCallback);
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
        var allSql,
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

        // Without this, psql runs all input and returns success even if errors occurred
        allSql = "\\set ON_ERROR_STOP TRUE\n" + allSql;

        winston.info("Applying build to database " + spec.database);
        credsClone.database = spec.database;
        sendToDatabase(allSql, credsClone, spec, function (err, res) {
          if (spec.populateData && creds.encryptionKeyFile) {
            var populateSql = "DO $$ XT.disableLocks = true; $$ language plv8;";
            var encryptionKey = fs.readFileSync(path.resolve(__dirname, "../../node-datasource", creds.encryptionKeyFile), "utf8");
            var patches = require(path.join(__dirname, "../../enyo-client/database/source/populate_data")).patches;
            _.each(patches, function (patch) {
              patch.encryptionKey = encryptionKey;
              patch.username = creds.username;
              populateSql += "select xt.patch(\'" + JSON.stringify(patch) + "\');";
            });
            populateSql += "DO $$ XT.disableLocks = undefined; $$ language plv8;";
            dataSource.query(populateSql, credsClone, databaseCallback);
          } else {
            databaseCallback(err, res);
          }
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

}());
