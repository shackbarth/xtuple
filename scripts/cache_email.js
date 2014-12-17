#!/usr/bin/env node

/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global _:true */

//
// In order to cache emails in the database, customers are going to want to set this
// to run on a cron.
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
    var sql = "SELECT setMetric('Test234', $1);"; // XXX obviously it won't be setMetric here

    // TODO: persist to email table
    // no need to use the existing eml tables
    // probably one table will suffice

    // columns could be:
    // id
    // subject
    // date
    // from
    // to
    // cc ? bcc ?
    // subject
    // body as text
    // body as html
    // attachments (maybe v2.0)
    // hash (hash the body as a way to check to see if this email is already in the table)
    // other fields from the header? (imap message id)

    // TODO: if the subject line matches some document, add to docass
    //   use the existing conventions for what the email subject should look like to denote
    //   a document link

    options.database = config.databases[0]; // XXX bit of an assumption here
    options.parameters = [JSON.stringify(results)]; // XXX obviously no
    dataSource.query(sql, options, function (err, insertResults) {
      console.log("Imap cache succeeded with " + results.length + " records");
    });
  });

}());
