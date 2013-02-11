#!/usr/bin/env node
/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";
  var orm = require('./orm'),
    argv = process.argv,
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

  orm.run(credentials, path);
}());
