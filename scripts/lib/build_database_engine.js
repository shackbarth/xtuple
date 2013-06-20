/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/

var fs = require('fs'),
  exec = require('child_process').exec,
  _ = require('underscore'),
  pg = require('pg'),
  async = require('async');

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

    _.each(specs, function (extensions, databaseName) {
      _.each(extensions, function (extension) {
        var manifestFilename = extension + "/database/source/manifest.js",
          manifestString,
          manifest;

        if (!fs.existsSync(manifestFilename)) {
          console.log("Cannot find manifest", manifestFilename);
          process.exit(1); // TODO: winston
        }
        manifestString = fs.readFileSync(manifestFilename, "utf8");
        try {
          manifest = JSON.parse(manifestString);
        } catch (error) {
          console.log("Manifest is not valid JSON", manifestFilename);
          process.exit(1); // TODO: winston

        }
        console.log(manifest);
      });
    });

  };

}());
