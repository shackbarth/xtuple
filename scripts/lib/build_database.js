/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/


var _ = require('underscore'),
  async = require('async'),
  dataSource = require('../../node-datasource/lib/ext/datasource').dataSource,
  exec = require('child_process').exec,
  fs = require('fs'),
  ormInstaller = require('../../node-datasource/installer/orm'),
  path = require('path'),
  pg = require('pg'),
  winston = require('winston');

(function () {
  "use strict";

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
  exports.buildDatabase = function (specs, creds, masterCallback) {
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
      // Step 2 in installing all scripts for a database:
      // Install all the extensions of the database, in series.
      //
      var installExtension = function (extension, extensionCallback) {
        winston.log("Installing extension", databaseName, extension);
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
          fs.readFile(fullFilename, "utf8", function (err, data) {
            var noticeSql = 'do $$ plv8.elog(NOTICE, "Running file ' + fullFilename + '"); $$ language plv8;\n';
            // TODO: worry about SQLi?
            monsterSql += noticeSql += data;

            scriptCallback(err, data);
          });

          /*
          pgClient.query(scriptContents, function (err, res) {
            if (err) {
              scriptCallback({
                filename: fullFilename,
                message: err.message,
                stack: err.stack,
                details: err
              });
              return;
            }
            scriptCallback(err, fullFilename); // TODO: do anything with res?
          });
          */
        };
        async.mapSeries(manifest.databaseScripts, installScript, function (err, res) {
          extensionCallback(err, res);
        });
        //
        // End script installation code
        //
      };

      async.mapSeries(extensions, installExtension, function (err, res) {

        if (err) {
          databaseCallback(err);
        } else {

          // Now would be an excellent time to run the orms for all of the
          // extensions on this database
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
      var pgClient = new pg.Client(creds),
        sql = "select orm_namespace as namespace, " +
          " orm_type as type " +
          "from xt.orm " +
          "where not orm_ext;";

      pgClient.connect();
      pgClient.query(sql, function (err, res) {
        if (err) {
          pgClient.end();
          callback(err);
          return;
        }

        pgClient.end();

        spec.orms = res.rows;
        installDatabase(spec, callback);
      });
    };

    //
    // Install all the databases
    //
    async.map(specs, preInstallDatabase, function (err, res) {
      if (err) {
        winston.error("err");
        if (masterCallback) {
          masterCallback(err);
        }
        return;
      }
      winston.info("Success installing all scripts");
      if (masterCallback) {
        masterCallback(null, res);
      }
    });
    //
    // End database installation code
    //
  };
}());
