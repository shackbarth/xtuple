#!/usr/bin/env node

/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global _:true */

//
// This file really just parses the arguments, and sends the real work
// off to scripts/lib/build_all.js.
//

(function () {
  "use strict";

  var program = require("commander"),
    path = require("path"),
    buildDatabaseUtil = require("./lib/build_database_util");

  program
    .option('-m, --manifest [/path/to/manifest.js]', 'Location of manifest file.')
    .parse(process.argv);

  buildDatabaseUtil.explodeManifest(path.join(__dirname, program.manifest), {}, function (err, contents) {
    if (err) {
      console.log("error: ", err);
      return;
    }
    console.log(contents);
  });

}());
