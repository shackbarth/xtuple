#!/usr/bin/env node
/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */


(function () {
    var orm = require('./orm'),
    creds = {
      hostname: 'localhost',
      username: 'shackbarth',
      port: '5432',
      database: 'dev3',
      organization: 'dev3'
    },
    path = '../../../public-extensions/source/crm/database/orm';

  orm.run(creds, path);

}());
