/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true */

(function () {
  "use strict";

  /**
    Keep track of all of the routes and register them under a single file
   */

  var report = require('./report'),
    maintenance = require('./maintenance'),
    auth = require('./auth'),
    //expor = require('./export'),
    file = require('./file');


  exports.report = report.report;
  exports.maintenance = maintenance.maintenance;
  exports.login = auth.login;
  exports.loginForm = auth.loginForm;
  exports.logout = auth.logout;
  exports.scope = auth.scope;
  exports.scopeForm = auth.scopeForm;
  //exports.expor = expor.expor;
  exports.file = file.file;

}());
