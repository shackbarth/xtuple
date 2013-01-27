#!/usr/bin/env node
/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

  require('../../../node-xt/foundation/foundation');
  require('../../../node-xt/database/database');


(function () {
  var X = {};
  var orm = require('./lib/orm');
  var argv = process.argv,
    credentials = {},
    path = argv[argv.indexOf("--path") + 1];
  if (path === 'node') {issue(X.fatal("You must provide a relative path of the orms to install with the --path argument"));}

  credentials.hostname = argv[argv.indexOf("-h") + 1];
  credentials.username = argv[argv.indexOf("-u") + 1];
  credentials.port = argv[argv.indexOf("-p") + 1];
  credentials.organization = argv[argv.indexOf("-d") + 1];

  // password is the lone exception here
  if (argv.indexOf("-P") > -1) credentials.password = argv[argv.indexOf("-P") + 1];
  else credentials.password = "";

  orm.run(credentials, path);
}());


  // if you want to run the installer programatically (i.e. not from the command line)
  // all you have to do is this:
  /*

  var orm = require('./lib/orm'),
    creds = {
      hostname: 'localhost',
      username: 'shackbarth',
      port: '5432',
      database: 'dev3',
      organization: 'dev3'
    };

  var path = '../../../public-extensions/source/crm/database/orm';
  orm.run(creds, path);

  */
