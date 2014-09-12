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
    authorizeNet = require('./authorize-net'),
    changePassword = require('./change_password'),
    clientCode = require('./client_code'),
    email = require('./email'),
    exxport = require('./export'),
    data = require('./data'),
    file = require('./file'),
    generateReport = require('./generate_report'),
    generateOauthKey = require('./generate_oauth_key'),
    installExtension = require('./install_extension'),
    locale = require('./locale'),
    passport = require('passport'),
    redirector = require('./redirector'),
    recover = require('./recover'),
    restDiscovery = require('./restDiscovery'),
    restRouter = require('./restRouter'),
    revokeOauthToken = require('./revoke_oauth_token'),
    vcfExport = require('./vcfExport');

  //
  // Authentication-related routes
  //
  exports.app = [ensureLogin, app.serveApp];
  exports.debug = [ensureLogin, app.serveDebug];
  exports.login = auth.login;
  exports.loginForm = auth.loginForm;
  exports.logout = auth.logout;
  exports.scope = auth.scope;
  exports.scopeForm = auth.scopeForm;

  exports.forgotPassword = recover.forgotPasswordForm;
  exports.recoverPassword = recover.recoverPassword;
  exports.verifyRecoverPassword = recover.verifyRecoverPassword;
  exports.resetRecoveredPassword = recover.resetRecoveredPassword;
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
  exports.creditCard = [ensureLogin, authorizeNet.transact];
  exports.changePassword = [ensureLogin, changePassword.changePassword];
  exports.clientCode = [ensureLogin, clientCode.clientCode];
  exports.email = [ensureLogin, email.email];
  exports.exxport = [ensureLogin, exxport.exxport];
  exports.file = [ensureLogin, file.file];
  exports.generateOauthKey = [ensureLogin, generateOauthKey.generateKey];
  exports.generateReport = [ensureLogin, generateReport.generateReport];
  exports.installExtension = [ensureLogin, installExtension.installExtension];
  exports.locale = [ensureLogin, locale.locale];
  exports.redirect = redirector.redirect;
  exports.resetPassword = [ensureLogin, changePassword.resetPassword];
  exports.revokeOauthToken = [ensureLogin, revokeOauthToken.revokeToken];
  exports.vcfExport = [ensureLogin, vcfExport.vcfExport];

}());
