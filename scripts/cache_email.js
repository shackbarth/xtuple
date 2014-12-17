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
    imapController = require("../node-datasource/controllers/ImapController"),
    dataSource = require('../node-datasource/lib/ext/datasource').dataSource,
    configPath,
    config;

  program
    .option('-c, --config [/path/to/alternate_config.js]', 'Location of datasource config file. [config.js]')
    .parse(process.argv);
  configPath = program.config ?
    path.resolve(process.cwd(), program.config) :
    path.resolve(__dirname, "../node-datasource/config.js");
  config = require(configPath);

  var query = [ 'ALL' ];
  // TODO: we should really store these creds in the database and have a UI to manage them
  imapController.searchAllImap(config.datasource.imap, query, function (err, results) {
    if (err) {
      console.log("Imap Cache Failed", err);
      return;
    }
    var options = JSON.parse(JSON.stringify(config.databaseServer));
    var sql = "SELECT setMetric('Test234', $1);";
    options.database = config.databases[0];
    options.parameters = [JSON.stringify(results)];
    dataSource.query(sql, options, function (err, insertResults) {
      console.log("Imap cache succeeded with " + results.length + " records");
      console.log("done", arguments);
    });
  });

}());
