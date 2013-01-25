/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true */

(function () {
  "use strict";

  /**
    Keep track of all of the routes and make them available from one place.
    Note that we also determine here which routes are behind the login wall
    by using ensureLogin.

    Note that this means each route does not take care of its authentication
    requirements, which is ok because some routes have variable authentication
    requirements depending on how they're used (maintenance). But that does
    mean that the routes should not be called directly. They should always
    be called through these exports.

    It would be possible to make the routes smarter and allow them to "register"
    themselves and their path. But that would come at the cost of indirection.
   */

  var logoutPath = {redirectTo: "/logout"},

    ensureLogin = require('connect-ensure-login').ensureLoggedIn(logoutPath),
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

  //
  // Authentication-related routes
  //
  exports.login = auth.login;
  exports.loginForm = auth.loginForm;
  exports.logout = auth.logout;
  exports.scope = auth.scope;
  exports.scopeForm = auth.scopeForm;

  //
  // Data-passthrough routes
  //
  // TODO: ensureLoggedIn
  exports.commit = [ensureLogin, data.commit];
  exports.commitEngine = data.commitEngine;
  exports.fetch = [ensureLogin, data.fetch];
  exports.fetchEngine = data.fetchEngine;
  exports.dispatch = [ensureLogin, data.dispatch];
  exports.dispatchEngine = data.dispatchEngine;
  exports.retrieve = [ensureLogin, data.retrieve];
  exports.retrieveEngine = data.retrieveEngine;

  //
  // Custom routes
  //
  exports.email = [ensureLogin, email.email];
  exports.extensions = [ensureLogin, extensions.extensions];
  exports.file = [ensureLogin, file.file];
  // the maintenance route as accessible by the app has login restrictions.
  exports.maintenance = [ensureLogin, maintenance.maintenance];
  // the maintenance route as accessible through the unexposed server has
  // no login restrictions. This is for ease of serverside scripting.
  exports.maintenanceLocalhost = maintenance.maintenance;
  exports.redirect = redirector.redirect;
  exports.report = [ensureLogin, report.report];
  exports.resetPassword = [ensureLogin, resetPassword.resetPassword];

}());
