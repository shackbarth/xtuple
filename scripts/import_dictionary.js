#!/usr/bin/env node
/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */

//
// This file really just parses the arguments, and sends the real work
// off to scripts/lib/build_dictionary.js.
//
(function () {
  "use strict";

  var program = require('commander'),
    importDictionary = require("./lib/build_dictionary").importDictionary;

  program
    .option('-d, --database [database name]', 'Database name to import to.')
    .option('-f, --filename [/path/to/filename]', 'Path to xTuple dictionary js file.')
    .parse(process.argv);

  importDictionary(program.database, program.filename, function (err, res) {
    if (err) {
      console.log("Import failed", err);
      return;
    }
    console.log("Success!");
  });

}());
