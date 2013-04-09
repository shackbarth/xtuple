#!/usr/bin/env node
/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XT:true, _:true */

_ = require("underscore");

require('../xt/foundation/foundation');
require('../xt/database/database');

if (typeof XT === 'undefined') {
  XT = {};
}

if (!X.options) {
  X.options = {};
  X.options.datasource = {};
}

(function () {
  "use strict";
  var argv = process.argv,
    credentials = {},
    path = argv[argv.indexOf("--path") + 1];

  //
  // Grab the credentials from the command line. You can skip this
  // and go straight to orm.run if you want to access the installer
  // programatically.
  //
  credentials.hostname = argv[argv.indexOf("-h") + 1];
  credentials.username = argv[argv.indexOf("-u") + 1];
  credentials.port = argv[argv.indexOf("-p") + 1];
  credentials.organization = argv[argv.indexOf("-d") + 1];

  // password is the lone exception here
  if (argv.indexOf("-P") > -1) {
    credentials.password = argv[argv.indexOf("-P") + 1];
  } else {
    credentials.password = "";
  }

  // Use pgWorker.
  if (argv.indexOf("-w") > -1) {
    X.log("Using a seperate pgWorker process.");
    X.options.datasource.pgWorker = true;
  } else {
    X.warn("Not using pgWorker process.");
    X.warn("Use '-w' command line flag to enable it if you want to.");
  }

  // Require orm after X.options setting.
  var orm = require('./orm');

  orm.run(credentials, path);
}());
