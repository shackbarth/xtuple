/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/

var _ = require('underscore'),
  async = require('async'),
  exec = require('child_process').exec,
  fs = require('fs'),
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
    console.log(specs);
    console.log(creds);
    return;
    _.each(specs, function (extensions, databaseName) {
      _.each(extensions, function (extension) {
        var manifestFilename = extension + "/database/source/manifest.js",
          manifestString,
          manifest;

        if (!fs.existsSync(manifestFilename)) {
          winston.error("Cannot find manifest", manifestFilename);
          process.exit(1); // TODO: winston
        }
        manifestString = fs.readFileSync(manifestFilename, "utf8");
        try {
          manifest = JSON.parse(manifestString);
        } catch (error) {
          winston.error("Manifest is not valid JSON", manifestFilename);
          process.exit(1); // TODO: winston

        }
        console.log(manifest);
      });
    });

  };

}());
