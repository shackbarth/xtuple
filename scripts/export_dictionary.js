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

  var _ = require("underscore"),
    async = require("async"),
    fs = require('fs'),
    path = require('path'),
    program = require('commander'),
    dictionaryToolkit = require("./lib/build_dictionary");

  program
    .option('-a, --apikey [api key]', 'Google Translate API key.')
    .option('-d, --database [database name]', 'Database name to export from.')
    .option('-l, --language [language]', 'Language name in form es_MX.')
    .option('-t, --total', 'Export the totality of the language files en batch.')
    .parse(process.argv);


  if (!program.total) {
    dictionaryToolkit.exportEnglish(
    {
      database: program.database,
      apiKey: program.apikey,
      language: program.language
    },
    function (err, res) {
      if (err) {
        console.log("Export failed", err);
        return;
      }
      console.log("Success!");
    });
    return;
  }


  //
  // Do a total batch export
  //
  if (program.database || program.language) {
    console.log("Don't enter a database name or a language. I'll take care of that.");
    return;
  }
  var buildAll = require('./lib/build_all');
  program.database = "linguist";

  //
  // Step 1: Create a database with the appropriate extensions
  //
  var buildPostbooks = function (done) {
    buildAll.build({
      database: program.database,
      initialize: true,
      source: path.join(__dirname, "../foundation-database/postbooks_demo_data.sql")
    }, done);
  };
  var buildExtensions = function (done) {
    var extensions = ["inventory", "manufacturing", "distribution"/*, "bi"*/];
    async.mapSeries(extensions, function (extension, next) {
      buildAll.build({
        database: program.database,
        frozen: (extension !== "bi"),
        extension: path.join(__dirname, "../../private-extensions/source", extension)
      }, next)}, done);
  };

  //
  // Step 2: Load all the language files that we have
  //
  var importExistingDictionaries = function (done) {
    fs.readdir(path.join(__dirname, "../../xtuple-linguist/translations"), function (err, files) {
      async.mapSeries(files, function (file, next) {
        var fullFilename = path.join(__dirname, "../../xtuple-linguist/translations", file);
        dictionaryToolkit.importDictionary(program.database, fullFilename, next);
      }, done);
    });
  };

  //
  // Step 3: Export in every language
  //
  var supportedLanguages = [
    {locale: "de_DE", label: "Deutch", english: "German"},
    {locale: "es_MX", label: "Español", english: "Spanish"},
    {locale: "fr_FR", label: "Français", english: "French"},
    {locale: "te_IN", label: "తెలుగు", english: "Telugu"},
    {locale: "zh_CN", label: "中国的", english: "Simplified Chinese"}
  ];
  var exportAllDictionaries = function (done) {
    async.mapSeries(supportedLanguages, function (language, next) {
      dictionaryToolkit.exportEnglish(
      {
        database: program.database,
        apiKey: program.apikey,
        language: language.locale,
        directory: path.join(__dirname, "../../xtuple-linguist/translations")
      }, next);
    }, done);
  };

  async.series([
    buildPostbooks,
    buildExtensions,
    importExistingDictionaries,
    exportAllDictionaries
  ], function (err, results) {
    if (err) {
      console.log("Export failed: ", err);
      return;
    }
    console.log("Success! Don't forget to commit and push xtuple-linguist!");
  });

}());
