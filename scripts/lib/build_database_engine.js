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

    @param {Object} creds look like this:
      { hostname: 'localhost',
        port: 5432,
        user: 'admin',
        password: 'admin',
        host: 'localhost',
        database: 'dev2' }
  */
  exports.buildDatabase = function (specs, creds) {

    console.log(specs);
    //winston.info("Building with specs", JSON.stringify(specs));

    // TODO: we probably need to use async at every level here to "know" when we're totally done
    _.each(specs, function (spec) {
      var extensions = spec.extensions;
      var databaseName = spec.database;
      var errorInDb = false;

      winston.info("Installing on database", databaseName);

      //
      // Step 1 in installing all scripts for a database:
      // Start a connection to the database
      //
      creds.database = databaseName;
      var pgClient = new pg.Client(creds);
      pgClient.connect();
      // queries are queued and executed one after another once the connection becomes available
      // TODO: begin transaction

      //
      // Step 2 in installing all scripts for a database:
      // Install all the extensions of the database, in series.
      //
      var installExtension = function (extension, callback) {
        if (errorInDb) {
          winston.error("Not installing extension", extension, "due to earlier error in db", databaseName);
          return;
        }
        winston.info("Installing extension", extension);
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
          callback("Cannot find manifest " + manifestFilename);
          return;
        }
        manifestString = fs.readFileSync(manifestFilename, "utf8");
        try {
          manifest = JSON.parse(manifestString);
        } catch (error) {
          errorInDb = true;
          callback("Manifest is not valid JSON" + manifestFilename);
          return;
        }


        //
        // Step 2 in installing extension scripts
        // Install all the scripts in the manifest file, in series.
        //
        var installScript = function (filename, callback) {
          var scriptContents = fs.readFileSync(path.join(dbSourceRoot, filename), "utf8");

          pgClient.query(scriptContents, function (err, res) {
            callback(err, res);
          });
        };
        async.mapSeries(manifest.databaseScripts, installScript, function (err, res) {
          if (err) {
            // TODO: rollback
            pgClient.end();
            errorInDb = true;

            callback(err);
            return;
          }
          // TODO: commit
          callback(null, databaseName + " " + extension + " scripts installed successfully");
          pgClient.end();
        });
        //
        // End script installation code
        //
      };
      async.mapSeries(extensions, installExtension, function (err, res) {
        if (err) {
          winston.error(err);
          return;
        }
        winston.info(JSON.stringify(res));
      });
      //
      // End extension installation code
      //
    });
  };
}());
