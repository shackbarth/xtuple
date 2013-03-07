/**
 * Module dependencies.
 */
var auth = require('../routes/auth')
  , oauth2orize = require('oauth2orize')
  , passport = require('passport')
  , login = require('connect-ensure-login')
  , db = require('./db')
  , utils = require('./utils');

// create OAuth 2.0 server
var server = oauth2orize.createServer();

// Register serialialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated.  To complete the transaction, the
// user must authenticate and approve the authorization request.  Because this
// may involve multiple HTTP request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session.  Typically this will be a
// simple matter of serializing the client's ID, and deserializing by finding
// the client by ID from the database.

server.serializeClient(function(client, done) {
  return done(null, client.id);
});

server.deserializeClient(function(id, done) {
  db.clients.find(id, function(err, client) {
    if (err) { return done(err); }
    return done(null, client);
  });
});

// Register supported grant types.
//
// OAuth 2.0 specifies a framework that allows users to grant client
// applications limited access to their protected resources.  It does this
// through a process of the user granting access, and the client exchanging
// the grant for an access token.

// Grant authorization codes.  The callback takes the `client` requesting
// authorization, the `redirectURI` (which is used as a verifier in the
// subsequent exchange), the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application.  The application issues a code, which is bound to these
// values, and will be exchanged for an access token.

server.grant(oauth2orize.grant.code(function (client, redirectURI, user, ares, done) {
  if (!client || !user || !redirectURI || !ares) { return done(null, false); }

  // Generate the auth code.
  var code = utils.uid(16);

  // Save auth data to the database.
  db.authorizationCodes.save(code, client.get("clientID"), redirectURI, user.id, ares.scope, function (err) {
    if (err) {
      return done(err);
    }

    done(null, code);
  });
}));

// Exchange authorization codes for access tokens.  The callback accepts the
// `client`, which is exchanging `code` and any `redirectURI` from the
// authorization request for verification.  If these values are validated, the
// application issues an access token on behalf of the user who authorized the
// code.

server.exchange(oauth2orize.exchange.code(function (client, code, redirectURI, done) {
  db.authorizationCodes.find(code, function (err, authCode) {
    if (err) { return done(err); }
    if (!authCode || !client) { return done(null, false); }
    if (client.get("clientID") !== authCode.get("clientID")) { return done(null, false); }
    if (redirectURI !== authCode.get("redirectURI")) { return done(null, false); }

    // Create the tokens.
    var accessToken = utils.uid(256),
        refreshToken = utils.uid(256),
        saveOptions = {},
        today = new Date(),
        expires = new Date(today.getTime() + (24 * 60 * 60 * 1000)),
        tokenAttributes = {},
        tokenType = 'bearer';

    saveOptions.success = function (model) {
      var params = {};

      params.token_type = model.get("tokenType");
      // Google sends time tell expires instead of just the time it expires at, so...
      params.expires_in = (new Date() - expires) / 1000; // Seconds until the token expires.

      // Send the tokens along.
      return done(null, model.get("accessToken"), model.get("refreshToken"), params);
    };
    saveOptions.error = function (model, err) {
      return done && done(err);
    };

    // Set model values and save.
    authCode.set("state", "Token Issued");
    authCode.set("authCode", null);
    authCode.set("authCodeExpires", new Date());
    authCode.set("refreshToken", refreshToken);
    authCode.set("refreshIssued", new Date());
    authCode.set("accessToken", accessToken);
    authCode.set("accessIssued", new Date());
    authCode.set("accessExpires", expires);
    authCode.set("tokenType", tokenType);
    authCode.set("accessType", "offline"); // Default for now...

    authCode.save(null, saveOptions);
  });
}));

server.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, done) {
  db.accessTokens.save(refreshToken, scope, client.id, function (err, accessToken) {
    if (err) { return done(err); }

    // TODO - This needs to repeat lots of the above token issuing code.
    // token_type, expires_in, refreshToken, etc.

    done(null, accessToken);
  });
}));



// user authorization endpoint
//
// `authorization` middleware accepts a `validate` callback which is
// responsible for validating the client making the authorization request.  In
// doing so, is recommended that the `redirectURI` be checked against a
// registered value, although security requirements may vary accross
// implementations.  Once validated, the `done` callback must be invoked with
// a `client` instance, as well as the `redirectURI` to which the user will be
// redirected after an authorization decision is obtained.
//
// This middleware simply initializes a new authorization transaction.  It is
// the application's responsibility to authenticate the user and render a dialog
// to obtain their approval (displaying details about the client requesting
// authorization).  We accomplish that here by routing through `ensureLoggedIn()`
// first, and rendering the `dialog` view.

exports.authorization = [
  server.authorization(function(clientID, redirectURI, scope, type, done) {
    db.clients.findByClientId(clientID, function(err, client) {
      if (err) { return done(err); }
      if (!client) { return done(null, false); }

      var matches = false;

      // For security purposes, we check that redirectURI provided
      // by the client matches one registered with the server.
      _.each(client.get("redirectURIs"), function (value, key, list) {
        // Check if the requested redirectURI is in approved client.redirectURIs.
        if (value === redirectURI) {
          matches = true;
        }
      });

      if (matches) {
        return done(null, client, redirectURI);
      } else {
        return done(null, false);
      }
    });
  }),
  function(req, res, next){
    // Load the OAuth req data into the session so it can access it on login redirects.
    if (req.oauth2) {
      req.session.oauth2 = req.oauth2;
      next();
    }

    // TODO - Client should be able to get a token for a userinfo REST call but
    // not have a selected org. login.ensureLoggedIn() needs to support this.
    // This would allow a client not to specify a scope, receive an error that includes
    // the URI to call to get a user's scope/org list: 'https://mobile.xtuple.com/auth/userinfo.xxx'
  },
  login.ensureLoggedIn({redirectTo: "/"}),
  function(req, res, next){
    var scope;

    if (req.session && req.session.passport && req.session.passport.user && req.session.passport.user.organization) {
      scope = req.session.passport.user.organization;
      res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user.id, client: req.oauth2.client.get("clientName"), scope: scope });
    } else {
      next(new Error('Invalid OAuth 2.0 scope.'));
    }
  }
]


//  function(req, res, next){
//    auth.scopeForm(req, res, next);
//  },

// user decision endpoint
//
// `decision` middleware processes a user's decision to allow or deny access
// requested by a client application.  Based on the grant type requested by the
// client, the above grant middleware configured above will be invoked to send
// a response.

exports.decision = [
  login.ensureLoggedIn({redirectTo: "/"}),
  server.decision(function(req, next){
    // Add the approved scope/org to req.oauth2.res.
    var ares = {};

    if (req.session && req.session.passport && req.session.passport.user && req.session.passport.user.organization) {
      ares.scope = req.session.passport.user.organization;
      return next(null, ares);
    } else {
      return next(new Error('Invalid OAuth 2.0 scope.'));
    }
  })
]


// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens.  Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request.  Clients must
// authenticate when making requests to this endpoint.

exports.token = [
  passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
  server.token(),
  server.errorHandler()
]
