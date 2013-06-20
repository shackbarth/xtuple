/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/

var _ = require('underscore'),
  async = require('async'),
  exec = require('child_process').exec,
  fs = require('fs'),
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
        console.log("create connection");
        creds.database = databaseName;
        pgClient = new pg.Client(creds);
        pgClient.connect();
        pgClient.query("BEGIN;", function (err, res) {
          console.log("begin", arguments);
          createCallback(err, res);
        });
      };

      //
      // Step 2 in installing all scripts for a database:
      // Install all the extensions of the database, in series.
      //
      var installExtension = function (extension, extensionCallback) {
        // I believe async makes the errorInDb convention unnecessary
        if (errorInDb) {
          winston.error("Not installing extension", extension, "due to earlier error in db", databaseName);
          return;
        }
        winston.log("Installing extension", databaseName, extension);
        var dbSourceRoot = path.join(extension, "database/source"),
          manifestFilename = path.join(dbSourceRoot, "manifest.js"),
          manifestString,
          manifest;

        //
        // Step 1 in installing extension scripts:
        // Read the manifest file
        //
        if (!fs.existsSync(manifestFilename)) {
          errorInDb = true;
          console.log("Cannot find manifest " + manifestFilename);
          winston.log("Cannot find manifest " + manifestFilename);
          extensionCallback("Cannot find manifest " + manifestFilename);
          return;
        }
        manifestString = fs.readFileSync(manifestFilename, "utf8");
        try {
          manifest = JSON.parse(manifestString);
        } catch (error) {
          errorInDb = true;
          console.log("Manifest is not valid JSON" + manifestFilename);
          winston.log("Manifest is not valid JSON" + manifestFilename);
          extensionCallback("Manifest is not valid JSON" + manifestFilename);
          return;
        }


        //
        // Step 2 in installing extension scripts
        // Install all the scripts in the manifest file, in series.
        //
        var installScript = function (filename, scriptCallback) {
          var scriptContents = fs.readFileSync(path.join(dbSourceRoot, filename), "utf8");

          console.log("install");
          pgClient.query(scriptContents, function (err, res) {
            scriptCallback(err, res);
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
        function (callback) {
          console.log("installing all extensions");
          async.mapSeries(extensions, installExtension, function (err, res) {
            if (err) {
              pgClient.query("ROLLBACK;", function (rollbackErr, rollbackRes) {
                console.log("rollback", arguments);
                // TODO: deal with a rollbackErr
                pgClient.end();
                errorInDb = true;

                callback(err);
              });
            } else {
              pgClient.query("COMMIT;", function (commitErr, commitRes) {
                console.log("commit", arguments);
                pgClient.end();
                // TODO: deal with a commitErr
                winston.log(res);
                callback(null, res);
              });
            }
          });
        }
      ], function (err, res) {
        databaseCallback(err, res);
      });
      //
      // End extension installation code
      //
    };
    async.map(specs, installDatabase, function (err, res) {
      if (err) {
        winston.error(err);
        return {isError: true, error: err};
      }
      winston.info("Success installing all scripts: " + JSON.stringify(res));
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
