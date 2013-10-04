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
    exportEnglish = require("./lib/build_dictionary").exportEnglish;

  program
    .option('-a, --apikey [api key]', 'Google Translate API key.')
    .option('-d, --database [database name]', 'Database name to export from.')
    .option('-l, --language [language]', 'Language name in form es_MX.')
    .parse(process.argv);

  exportEnglish(program.database, program.apikey, program.language, function (err, res) {
    if (err) {
      console.log("Export failed", err);
      return;
    }
    console.log("Success!");
  });

}());
