/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true */

(function () {
  "use strict";

  /**
    Keep track of all of the routes and register them under a single file
   */

  var ensureLogin = require('connect-ensure-login').ensureLoggedIn,
    logoutPath = {redirectTo: "/logout"},
    auth = require('./auth'),
    email = require('./email'),
    extensions = require('./extensions'),
    data = require('./data'),
    file = require('./file'),
    maintenance = require('./maintenance'),
    redirector = require('./redirector'),
    report = require('./report'),
    resetPassword = require('./resetPassword');

  //  TODO: ensure login should be customized to also check for a username and organization

  exports.login = auth.login;
  exports.loginForm = auth.loginForm;
  exports.logout = auth.logout;
  exports.scope = auth.scope;
  exports.scopeForm = auth.scopeForm;
  exports.email = [ensureLogin(logoutPath), email.email];
  exports.extensions = [ensureLogin(logoutPath), extensions.extensions];
  exports.file = [ensureLogin(logoutPath), file.file];
  exports.maintenance = maintenance.maintenance; // TODO: authentication restrictions
  exports.redirect = redirector.redirect;
  exports.report = [ensureLogin(logoutPath), report.report];
  exports.resetPassword = [ensureLogin(logoutPath), resetPassword.resetPassword];

  exports.commit = [ensureLogin(logoutPath), data.commit];
  exports.commitEngine = [ensureLogin(logoutPath), data.commitEngine];
  exports.fetch = [ensureLogin(logoutPath), data.fetch];
  exports.fetchEngine = [ensureLogin(logoutPath), data.fetchEngine];
  exports.dispatch = [ensureLogin(logoutPath), data.dispatch];
  exports.dispatchEngine = [ensureLogin(logoutPath), data.dispatchEngine];
  exports.retrieve = [ensureLogin(logoutPath), data.retrieve];
  exports.retrieveEngine = [ensureLogin(logoutPath), data.retrieveEngine];

}());
