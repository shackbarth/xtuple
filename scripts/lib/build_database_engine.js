/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/

var _ = require('underscore'),
  async = require('async'),
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
        host: 'localhost',
        database: 'dev2' }
  */
  exports.buildDatabase = function (specs, creds) {
    // TODO: set up winston file transport
    winston.log("Building databases with specs", JSON.stringify(specs));

    //
    // Install all extension scripts into a database
    //
    var installDatabase = function (spec, databaseCallback) {
      var extensions = spec.extensions,
        databaseName = spec.database,
        errorInDb = false,
        pgClient;

      winston.log("Installing on database", databaseName);

      //
      // Step 1 in installing all scripts for a database:
      // Start a connection to the database
      //
      var createConnection = function (createCallback) {
        creds.database = databaseName;
        creds.organization = creds.database; // adapt our lingo to orm installer lingo
        pgClient = new pg.Client(creds);
        pgClient.connect();
        pgClient.query("BEGIN;", function (err, res) {
          createCallback(err, res);
        });
      };

      //
      // Step 2 in installing all scripts for a database:
      // Install all the extensions of the database, in series.
      //
      var installExtension = function (extension, extensionCallback) {
        // TODO: I believe async makes the errorInDb convention unnecessary
        if (errorInDb) {
          winston.error("Not installing extension", extension, "due to earlier error in db", databaseName);
          return;
        }
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
          errorInDb = true;
          winston.log("Cannot find manifest " + manifestFilename);
          extensionCallback("Cannot find manifest " + manifestFilename);
          return;
        }
        manifestString = fs.readFileSync(manifestFilename, "utf8");
        try {
          manifest = JSON.parse(manifestString);
        } catch (error) {
          errorInDb = true;
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
          var scriptContents = fs.readFileSync(fullFilename, "utf8");

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
        };
        async.mapSeries(manifest.databaseScripts, installScript, function (err, res) {
          extensionCallback(err, res);
        });
        //
        // End script installation code
        //
      };

      //
      // Use async to make sure that the tranaction is started before we try to do anything else
      //
      async.series([
        createConnection,
        function () { // don't need to use the callback parameter here
          async.mapSeries(extensions, installExtension, function (err, res) {
            //
            // All of the extensions have just been installed. Now is the time
            // to commit or rollback, depending on the success.
            //

            // TODO: now would be an excellent time to run the orms for all of the
            // extensions on this database

            if (err) {
              pgClient.query("ROLLBACK;", function (rollbackErr, rollbackRes) {
                // TODO: deal with a rollbackErr
                pgClient.end();
                errorInDb = true;
                winston.log("rollback on error", err);

                databaseCallback(err);
              });
            } else {
              pgClient.query("COMMIT;", function (commitErr, commitRes) {
                pgClient.end();
                // TODO: deal with a commitErr
                winston.log("commit on success", res);
                databaseCallback(err, res);
              });
            }
          });
        }
      ]);
      //
      // End extension installation code
      //
    };
    async.map(specs, installDatabase, function (err, res) {
      if (err) {
        winston.error(err);
        return {isError: true, error: err};
      }
      winston.info("Success installing all scripts");
      return {
        message: "Success installing all scripts",
        data: res
      };
    });
    //
    // End database installation code
    //
  };
}());
