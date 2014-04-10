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

  var fs = require("fs"),
    program = require("commander"),
    path = require("path"),
    buildDatabaseUtil = require("./lib/build_database_util");

  program
    .option('-m, --manifest [/path/to/manifest.js]', 'Location of manifest file.')
    .option('-n, --name [inventory_upgrade.sql]', 'Name of destination file.')
    .parse(process.argv);

  // the path is not relative if it starts with a slash
  var manifestPath = program.manifest.substring(0, 1) === '/' ?
    program.manifest :
    path.join(process.cwd(), program.manifest);

  buildDatabaseUtil.explodeManifest(manifestPath, {}, function (err, contents) {
    var outputFile;
    if (err) {
      console.log("error: ", err);
      return;
    }
    if (!fs.existsSync(path.join(__dirname, "output"))) {
      fs.mkdirSync(path.join(__dirname, "output"));
    }

    outputFile = path.join(__dirname, "output", program.name);
    fs.writeFile(outputFile, contents, function (err, res) {
      if (err) {
        console.log("error: ", err);
        return;
      }
      console.log("File successfully written as ", outputFile);
    });
  });

}());
