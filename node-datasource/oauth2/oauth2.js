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
  var code = utils.uid(16)

  db.authorizationCodes.save(code, client.id, redirectURI, user.id, function (err) {
    if (err) { return done(err); }
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
    if (client.id !== authCode.clientID) { return done(null, false); }
    if (redirectURI !== authCode.redirectURI) { return done(null, false); }

    // Create the tokens.
    var accessToken = utils.uid(256),
        refreshToken = utils.uid(256),
        params = {};

    params.token_type = 'bearer';
    params.expires_in = new Date(today.getTime() + (24 * 60 * 60 * 1000));

    // Save the accessToken.
    // TODO - Save params.expires_in and use that to validate tokens.
    db.accessTokens.save(accessToken, authCode.userID, authCode.clientID, function (err) {
      if (err) {
        return done(err);
      }

      // TODO - Need a refreshToken store.
      // It should have:
      // - user_id,
      // - client_id, - Client sending Oauth requests.
      // - redirect_uri, - Determines where the response is sent.
      // - scope, - List of scopes that access was granted for for this token. Just one org and maybe the userinfo scope.
      // - state, - Indicates any state which may be useful to your application upon receipt of the response.
      // - approval_prompt, - Indicates if the user should be re-prompted for consent.
      // - auth_code, - Removed after first exchange for...
      // - auth_code_issued, - Datetime auth code was issued. If more than 30 minutes have passed without exchange, remove whole row.
      // - auth_code_expires_in, - GMT datetime when this code expires.
      // - refresh_token, - Does not expire
      // - refresh_token_issued, - Datetime refresh token was created
      // - refresh_expires_in, - GMT datetime when this token expires.
      // - access_token, - Current issued/valid access token.
      // - access_token_issued, - GMT datetime when this token was issued.
      // - access_expires_in, - GMT datetime when this token expires.
      // - token_type, - Bearer for now, MAC later
      // - access_type, - online or offline
      // - delegate, - user_id for which the application is requesting delegated access as.

      // TODO - Need client store.
      // It should have:
      // - client_id, - Generated id
      // - client_secret, - Generated random key.
      // - client_name, - Name of app requesting permission.
      // - client_email, - Contact email for the client app.
      // - client_web_site, - URL for the client app.
      // - client_logo, - logo image for the client app.
      // - client_type, - "web_server", "installed_app", "service_account"
      // - active, - Boolean to deactivate a client.
      // - issued, - Datetime client was registered.
      // - auth_uri,
      // - token_uri,
      // - redirect_uris, - URIs registered for this client to redirect to.
      // - delegated_access, - Boolean if "service_account" can act on behalf of other users
      // - client_x509_cert_url, - Public key cert for "service_account"
      // - auth_provider_x509_cert_url

      // Save the refreshToken.
      db.accessTokens.save(refreshToken, authCode.userID, client.id, function (err) {
        if (err) {
          return done(err);
        }

        // TODO - Now that the auth code has been exchanged, we need to delete it.

        // Send the tokens along.
        done(null, accessToken, refreshToken, params);
      });
    });
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
      // WARNING: For security purposes, it is highly advisable to check that
      //          redirectURI provided by the client matches one registered with
      //          the server.  For simplicity, this example does not.  You have
      //          been warned.
      return done(null, client, redirectURI);
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
  function(req, res){
    res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
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
  server.decision()
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
