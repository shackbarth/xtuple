#!/usr/bin/env node

/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/

//
// This file really just parses the arguments, and sends the real work
// off to lib/build.js.
//

(function () {
  "use strict";

  var program = require('commander'),
    build = require("./lib/build_all").build;

  program
    .option('-d, --database [database name]', 'Use specific database. [All databases in config file.]')
    .option('-e, --extension [/path/to/extension]', 'Extension to build. [Core plus all extensions registered for the database.]')
    .option('-i, --initialize', 'Initialize database. Must be used with the -b flag.')
    .option('-b, --backup [/path/to/backup/file]', 'Location of database backup file. Must be used with the -i flag.')
    .parse(process.argv);

  build({
    database: program.database,
    // regex: remove trailing slash if present
    // TODO: regex probably unnecessary now that I'm using path.join
    extension: program.extension && program.extension.replace(/\/$/, ""),
    initialize: program.initialize,
    backup: program.backup
  }, function (err, res) {
    if (err) {
      console.log("Error", err);
      return;
    }
    console.log("Success!", res);
  });

}());
