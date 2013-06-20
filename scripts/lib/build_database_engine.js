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
      { dev:
       [ '/home/user/git/xtuple/scripts/../enyo-client',
         '/home/user/git/xtuple/scripts/../enyo-client/extensions/source/crm',
         '/home/user/git/xtuple/scripts/../enyo-client/extensions/source/project',
         '/home/user/git/xtuple/scripts/../../private-extensions/source/incident_plus' ],
      dev2:
       [ '/home/user/git/xtuple/scripts/../enyo-client',
         '/home/user/git/xtuple/scripts/../enyo-client/extensions/source/crm',
         '/home/user/git/xtuple/scripts/../../private-extensions/source/incident_plus',
       ]
      }
    @param {Object} creds look like this:
      { hostname: 'localhost',
        port: 5432,
        user: 'admin',
        password: 'admin',
        host: 'localhost',
        database: 'dev2' }
  */
  exports.buildDatabase = function (specs, creds) {

    //winston.info("Building with specs", JSON.stringify(specs));
    console.log(creds);
    console.log(specs);




    _.each(specs, function (extensions, databaseName) {
      var errorInDb = false;

      winston.info("Installing on database", databaseName);
      creds.database = databaseName;
      var pgClient = new pg.Client(creds);
      pgClient.connect();
      // TODO: begin transaction
      // queries are queued and executed one after another once the connection becomes available

      // TODO: we probably need to use async at every level here to "know" when we're totally done
      _.each(extensions, function (extension) {
        if (errorInDb) {
          winston.error("Not installing extension", extension, "due to earlier error in db", databaseName);
          return;
        }
        winston.info("Installing extension", extension);
        var dbSourceRoot = path.join(extension, "database/source"),
          manifestFilename = path.join(dbSourceRoot, "manifest.js"),
          manifestString,
          manifest;

        if (!fs.existsSync(manifestFilename)) {
          winston.error("Cannot find manifest", manifestFilename);
          errorInDb = true;
          return;
        }
        manifestString = fs.readFileSync(manifestFilename, "utf8");
        try {
          manifest = JSON.parse(manifestString);
        } catch (error) {
          winston.error("Manifest is not valid JSON", manifestFilename);
          errorInDb = true;
          return;
        }


        var installFile = function (filename, callback) {
          var fileContents = fs.readFileSync(path.join(dbSourceRoot, filename), "utf8");
          var result = pgClient.query(fileContents, function (err, res) {
            callback(err, res);
          });
        };

        async.map(manifest.databaseFiles, installFile, function (err, res) {
          if (err) {
            winston.error("Error installing file", err);
            // TODO: rollback
            pgClient.end();
            errorInDb = true;
            return;
          }
          // TODO: commit
          winston.info(databaseName, extension, "files installed successfully");
          pgClient.end();

        });

      });
    });

  };

}());
