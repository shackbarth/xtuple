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
    // this is going to look magical down where it's used. Basically ensureLoggedIn
    // is a function that returns another function, and express allows routes to
    // be defined in such a way as to chain these types of functions together in an array.
    ensureLogin = require('connect-ensure-login').ensureLoggedIn(logoutPath),
    app = require('./app'),
    auth = require('./auth'),
    changePassword = require('./change_password'),
    clientCode = require('./client_code'),
    email = require('./email'),
    exxport = require('./export'),
    data = require('./data'),
    dataFromKey = require('./data_from_key'),
    file = require('./file'),
    passport = require('passport'),
    redirector = require('./redirector'),
    report = require('./report'),
    analysis = require('./analysis'),
    restDiscovery = require('./restDiscovery'),
    restRouter = require('./restRouter');

  //
  // Authentication-related routes
  //
  exports.app = [ensureLogin, app.serveApp];
  exports.login = auth.login;
  exports.loginForm = auth.loginForm;
  exports.logout = auth.logout;
  exports.scope = auth.scope;
  exports.scopeForm = auth.scopeForm;

  //
  // Data-passthrough routes
  //
  exports.queryDatabase = data.queryDatabase;
  exports.delete = [ensureLogin, data.delete];
  exports.get = [ensureLogin, data.get];
  exports.patch = [ensureLogin, data.patch];
  exports.post = [ensureLogin, data.post];

  //
  // REST API Routes
  exports.restDiscoveryList = [
    restDiscovery.list
  ];
  exports.restDiscoveryGetRest = [
    restDiscovery.getRest
  ];
  exports.restRouter = [
    passport.authenticate('bearer', { session: false }),
    restRouter.router
  ];

  //
  // Custom routes
  //
  exports.changePassword = [ensureLogin, changePassword.changePassword];
  exports.clientCode = [ensureLogin, clientCode.clientCode];
  exports.dataFromKey = dataFromKey.dataFromKey; // don't authenticate
  exports.email = [ensureLogin, email.email];
  exports.exxport = [ensureLogin, exxport.exxport];
  exports.file = [ensureLogin, file.file];
  exports.redirect = redirector.redirect;
  exports.report = [ensureLogin, report.report];
  exports.analysis = [ensureLogin, analysis.analysis];
  exports.resetPassword = [ensureLogin, changePassword.resetPassword];

}());
