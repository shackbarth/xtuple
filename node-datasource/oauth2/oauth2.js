/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true, expr:true */
/*global X:true, SYS:true, _:true, console:true*/

/**
 * Module dependencies.
 */
var auth = require('../routes/auth'),
    oauth2orize = require('oauth2orize'),
    jwtBearer = require('oauth2orize-jwt-bearer').Exchange,
    passport = require('passport'),
    login = require('connect-ensure-login'),
    db = require('./db'),
    url = require('url'),
    utils = require('./utils'),
    privateSalt = X.fs.readFileSync(X.options.datasource.saltFile).toString();

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

server.serializeClient(function (client, done) {
  "use strict";

  return done(null, client);
});

server.deserializeClient(function (client, done) {
  "use strict";

  db.clients.find(client, function (err, foundClient) {
    if (err) { return done(err); }
    return done(null, foundClient);
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
  "use strict";

  if (!client || !user || !redirectURI || !ares) { return done(null, false); }

  // Generate the auth code.
  var code = utils.generateUUID(),
      salt = '$2a$10$' + client.get("clientID").replace(/[^a-zA-Z0-9]/g, "").substring(0, 22),
      codehash = X.bcrypt.hashSync(code, salt);

  // The authCode can be used to get a refreshToken and accessToken. We bcrypt the authCode
  // so if our database is ever compromised, the stored authCode hashes are worthless.

  if (!Array.isArray(ares.scope)) { ares.scope = [ ares.scope ]; }

  // Save auth data to the database.
  db.authorizationCodes.save(codehash, client.get("clientID"), redirectURI, user.id, ares.scope, function (err) {
    if (err) {
      return done(err);
    }

    // Return the code to the client.
    done(null, code);
  });
}));

// Exchange authorization codes for access tokens.  The callback accepts the
// `client`, which is exchanging `code` and any `redirectURI` from the
// authorization request for verification.  If these values are validated, the
// application issues an access token on behalf of the user who authorized the
// code.

server.exchange(oauth2orize.exchange.code(function (client, code, redirectURI, done) {
  "use strict";

  if (!client || !code || !redirectURI) { return done(null, false); }

  // Best practice is to use a random salt in each bcrypt hash. Since we need to query the
  // database for a valid authCode, we would have to loop through all the hashes
  // and hash the authCode the client sent using each salt and check for a match.
  // That could take a lot of CPU if there are 1000's of authCodes. Instead, we will
  // use known salt we can look up that is also in the request to exchange authCodes.
  // The salt is the client_id trimmed to 22 characters. Unfortunately, this trade off means
  // the bcrypt salt will be shared across all authCodes issued for a single client.

  if (client.get("clientID").length < 22) {
    console.trace("OAuth 2.0 clientID, ", client.get("clientID"), " is too short to use for bcrypt salt.");
    return done(new Error("Invalid authorization code."));
  }

  // bcrypt the code before looking for a matching hash.
  var salt = '$2a$10$' + client.get("clientID").replace(/[^a-zA-Z0-9]/g, "").substring(0, 22),
      codehash = X.bcrypt.hashSync(code, salt);

  db.authorizationCodes.find(codehash, client.get("organization"), function (err, authCode) {
    if (err) { return done(err); }
    if (!authCode) { return done(null, false); }
    if (client.get("clientID") !== authCode.get("clientID")) { return done(new Error("Invalid clientID.")); }
    if (redirectURI !== authCode.get("redirectURI")) { return done(new Error("Invalid redirectURI.")); }

    // Now that we've looked up the bcrypt authCode hash, double check that the code
    // sent by the client actually matches using compareSync() this time.
    if (!X.bcrypt.compareSync(code, authCode.get("authCode"))) {
      console.trace("OAuth 2.0 authCode failed bcrypt compare. WTF?? This should not happen.");
      return done(new Error("Invalid authorization code."));
    }

    // Auth code is only valid for 10 minutes. Has it expired yet?
    if ((new Date(authCode.get("authCodeExpires")) - new Date()) < 0) {
      authCode.destroy();
      return done(new Error("Authorization code has expired."));
    }

    var accessToken = utils.generateUUID(),
        refreshToken = utils.generateUUID(),
        accesshash,
        refreshhash,
        saveOptions = {},
        today = new Date(),
        expires = new Date(today.getTime() + (60 * 60 * 1000)), // One hour from now.
        tokenType = 'bearer';

    // A refreshToken is like a password. It currently never expires and with it, you can
    // get a new accessToken. We bcrypt the refreshToken so if our database is ever
    // compromised, the stored refreshToken hashes are worthless.
    refreshhash = X.bcrypt.hashSync(refreshToken, salt);

    // The accessToken is only valid for 1 hour and must be sent with each request to
    // the REST API. The bcrypt hash calculation on each request would be too expensive.
    // Therefore, we do not need to bcrypt the accessToken, just SHA1 it.
    accesshash = X.crypto.createHash('sha1').update(privateSalt + accessToken).digest("hex");

    saveOptions.success = function (model) {
      if (!model) { return done(null, false); }
      var params = {};

      params.token_type = model.get("tokenType");
      // Google sends time until expires instead of just the time it expires at, so...
      params.expires_in = Math.round(((expires - today) / 1000) - 60); // Seconds until the token expires with 60 sec padding.

      // Send the tokens and params along.
      return done(null, accessToken, refreshToken, params);
    };
    saveOptions.error = function (model, err) {
      return done && done(err);
    };
    saveOptions.database = client.get("organization");

    // Set model values and save.
    authCode.set("state", "Token Issued");
    authCode.set("authCode", null);
    authCode.set("authCodeExpires", today);
    authCode.set("refreshToken", refreshhash);
    authCode.set("refreshIssued", today);
    authCode.set("accessToken", accesshash);
    authCode.set("accessIssued", today);
    authCode.set("accessExpires", expires);
    authCode.set("tokenType", tokenType);
    authCode.set("accessType", "offline"); // Default for now...

    authCode.save(null, saveOptions);
  });
}));

// Exchange a refresh token for a new access tokens. The callback accepts the
// `Oauth2client` model, `Oauth2token` model and a done callback. If these
// values are valid, the application issues an access token on behalf of the
// user who authorized the code.

server.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, done) {
  "use strict";

  if (!client || !refreshToken) { return done(null, false); }

  // Best practice is to use a random salt in each bcrypt hash. Since we need to query the
  // database for a valid refreshToken, we would have to loop through all the hashes
  // and hash the refreshToken the client sent using each salt and check for a match.
  // That could take a lot of CPU if there are 1000's of refreshTokens. Instead, we will
  // use known salt we can look up that is also in the request to use refreshTokens.
  // The salt is the client_id trimmed to 22 characters. Unfortunately, this trade off means
  // the bcrypt salt will be shared across all refreshTokens issued for a single client.

  if (client.get("clientID").length < 22) {
    console.trace("OAuth 2.0 clientID, ", client.get("clientID"), " is too short to use for bcrypt salt.");
    return done(new Error("Invalid refresh token."));
  }

  // bcrypt the refreshToken before looking for a matching hash.
  var salt = '$2a$10$' + client.get("clientID").replace(/[^a-zA-Z0-9]/g, "").substring(0, 22),
      refreshhash = X.bcrypt.hashSync(refreshToken, salt);

  db.accessTokens.findByRefreshToken(refreshhash, client.get("organization"), function (err, token) {
    if (err) { return done(err); }
    if (!token) { return done(null, false); }
    if (client.get("clientID") !== token.get("clientID")) { return done(new Error("Invalid clientID.")); }

    // Now that we've looked up the bcrypt refreshToken hash, double check that the code
    // sent by the client actually matches using compareSync() this time.
    if (!X.bcrypt.compareSync(refreshToken, token.get("refreshToken"))) {
      console.trace("OAuth 2.0 refreshToken failed bcrypt compare. WTF?? This should not happen.");
      return done(new Error("Invalid refresh token."));
    }

    // Refresh tokens do not currently expire, but we might add that feature in the future. Has it expired yet?
    // TODO - refreshExpires === null means refreshToken doesn't expire. If we change that, determine how to handle null.
    if (token.get("refreshExpires") && ((new Date(token.get("refreshExpires")) - new Date()) < 0)) {
      token.destroy();
      return done(new Error("Refresh token has expired."));
    }

    var accessToken = utils.generateUUID(),
        accesshash,
        saveOptions = {},
        today = new Date(),
        expires = new Date(today.getTime() + (60 * 60 * 1000)); // One hour from now.

    // The accessToken is only valid for 1 hour and must be sent with each request to
    // the REST API. The bcrypt hash calculation on each request would be too expensive.
    // Therefore, we do not need to bcrypt the accessToken, just SHA1 it.
    accesshash = X.crypto.createHash('sha1').update(privateSalt + accessToken).digest("hex");

    saveOptions.success = function (model) {
      if (!model) { return done(null, false); }
      var params = {};

      params.token_type = model.get("tokenType");
      // Google sends time until expires instead of just the time it expires at, so...
      params.expires_in = Math.round(((expires - today) / 1000) - 60); // Seconds until the token expires with 60 sec padding.

      // Send the accessToken and params along.
      // We do not send the refreshToken because they already have it.
      return done(null, accessToken, null, params);
    };
    saveOptions.error = function (model, err) {
      return done && done(err);
    };

    saveOptions.database = client.get("organization");

    // Set model values and save.
    token.set("state", "Token Refreshed");
    token.set("accessToken", accesshash);
    token.set("accessIssued", today);
    token.set("accessExpires", expires);

    token.save(null, saveOptions);
  });
}));

// Exchange a JSON Web Token (JWT) for a new access tokens. The callback accepts
// the `Oauth2client` model, the JWT base64URLencoded header, claimSet and
// signature parts and a done callback. If these values are valid, the
// application issues an access token on behalf of the user in the JWT `prn`
// property.
var jwtExchange = function (client, header, claimSet, signature, done) {
  "use strict";

  var data = header + "." + claimSet,
      pub = client.get("clientX509PubCert"),
      verifier = X.crypto.createVerify("RSA-SHA256");

  verifier.update(data);

  if (verifier.verify(pub, utils.base64urlUnescape(signature), 'base64')) {
    var accessToken = utils.generateUUID(),
        accesshash,
        decodedHeader = JSON.parse(utils.base64urlDecode(header)),
        decodedClaimSet = JSON.parse(utils.base64urlDecode(claimSet)),
        expDate,
        initCallback,
        iatDate,
        saveOptions = {},
        today = new Date(),
        expires = new Date(today.getTime() + (60 * 60 * 1000)), // One hour from now.
        token = new SYS.Oauth2token();


    // Verify JWT was formed correctly.
    if (!decodedHeader || !decodedHeader.alg || !decodedHeader.typ) {
      return done(new Error("Invalid JWT header."));
    }

    if (!decodedClaimSet || decodedClaimSet.length < 5 || !decodedClaimSet.iss ||
      !decodedClaimSet.scope || !decodedClaimSet.aud || !decodedClaimSet.exp ||
      !decodedClaimSet.iat) {

      return done(new Error("Invalid JWT claim set."));
    }

    // These dates will be valid epoch timestamps because of (... * 1000)
    // don't use for initial check of epoch validity below.
    expDate = new Date(decodedClaimSet.exp * 1000);
    iatDate = new Date(decodedClaimSet.iat * 1000);

    if (((new Date(decodedClaimSet.exp)).getTime() <= 0) || ((new Date(decodedClaimSet.iat)).getTime() <= 0) || // exp && iat are NOT valid epoch timestamps.
      ((expDate.getTime()) - (iatDate.getTime()) <= 0) || // exp - iat <= 0
      ((expDate.getTime()) - (iatDate.getTime()) > 3600000) || // exp is more than 1 hour from the iat time.
      (((iatDate - today) - (10 * 60 * 1000)) > 0) // Great Scott! JWT was issued in the future. 10 minute buffer for clock errors.
      ) {

      return done(new Error("Invalid JWT timestamps."));
    }

    // Is the JWT ClaimSet.iss a valid clientID?
    if (client.get("clientID") !== decodedClaimSet.iss) {
      return done(new Error("Invalid JWT iss."));
    }

    // JWT is only valid for 1 hour. Has it expired yet?
    if ((expDate - today) < 0) {
      return done(new Error("JWT has expired."));
    }

    // Validate decodedClaimSet.prn user and scopes.
    if (client.get("delegatedAccess") && decodedClaimSet.prn) {
      db.users.findByUsername(decodedClaimSet.prn, client.get("organization"), function (err, user) {
        if (err) { return done(new Error("Invalid JWT delegate user.")); }
        if (!user) { return done(null, false); }

        var separator = ' ',
            jwtScopes = decodedClaimSet.scope.split(separator),
            scope,
            scopes = [];

        if (!Array.isArray(jwtScopes)) { jwtScopes = [ jwtScopes ]; }

        // Loop through the scope URIs and convert them to org names.
        _.each(jwtScopes, function (scopeValue, scopeKey, scopeList) {
          var scopeOrg;

          // Get the org from the scope URI e.g. 'dev' from: 'https://mobile.xtuple.com/auth/dev'
          scope = url.parse(scopeValue, true);
          scopeOrg = scope.path.split("/")[1];

          if (user.get("organization") === scopeOrg) {
            scopes[scopeKey] = scopeOrg;
          }
        });

        if (scopes.length < 1) {
          return done(new Error("Invalid JWT scope."));
        }

        // JWT is valid, create access token, save and return it.

        // The accessToken is only valid for 1 hour and must be sent with each request to
        // the REST API. The bcrypt hash calculation on each request would be too expensive.
        // Therefore, we do not need to bcrypt the accessToken, just SHA1 it.
        accesshash = X.crypto.createHash('sha1').update(privateSalt + accessToken).digest("hex");

        saveOptions.success = function (model) {
          if (!model) { return done(null, false); }
          var params = {};

          params.token_type = model.get("tokenType");
          // Google sends time until expires instead of just the time it expires at, so...
          params.expires_in = Math.round(((expires - today) / 1000) - 60); // Seconds until the token expires with 60 sec padding.

          // Send the accessToken and params along.
          // We do not send the refreshToken because they already have it.
          return done(null, accessToken, params);
        };
        saveOptions.error = function (model, err) {
          return done && done(err);
        };

        saveOptions.database = scopes[0];

        initCallback = function (model, value) {
          if (model.id) {
            // Now that model is ready, set attributes and save.
            var tokenAttributes = {
              clientID: client.get("clientID"),
              scope: JSON.stringify(scopes),
              state: "JWT Access Token Issued",
              approvalPrompt: false,
              accessToken: accesshash,
              accessIssued: today,
              accessExpires: expires,
              tokenType: "bearer",
              accessType: "offline",
              delegate: user.get("username")
            };

            // Try to save access token data to the database.
            model.save(tokenAttributes, saveOptions);
          } else {
            return done && done(new Error('Cannot save access token. No id set.'));
          }
        };

        // Register on change of id callback to know when the model is initialized.
        token.on('change:id', initCallback);

        // Set model values and save.
        token.initialize(null, {isNew: true, database: scopes[0]});
      });
    } else {
      // Either there is no prn, OR client.delegatedAccess is not enabled.
      // TODO: Right now, if you create a service account and uncheck the "delegatedAccess"
      //   field, then you will see this error. We need to handle public scopes with no
      //   delegated users here.
      return done(new Error("Invalid JWT. No delegated user or delegated access is not enabled for this client."));
    }
  } else {
    return done(new Error("Invalid JWT. Signature verification failed"));
  }
};
// Support both known grant types.
server.exchange('assertion', jwtBearer(jwtExchange));
server.exchange('urn:ietf:params:oauth:grant-type:jwt-bearer', jwtBearer(jwtExchange));

// TODO - We need a token revoke endpoint some day.
//https://developers.google.com/accounts/docs/OAuth2WebServer#tokenrevoke


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
  server.authorization(function (clientID, redirectURI, scope, type, done) {
    "use strict";

    // Get the org from the scope URI e.g. 'dev' from: 'https://mobile.xtuple.com/auth/dev'
    scope = url.parse(scope[0], true);
    var scopeOrg = scope.path.split("/")[1] || null;

    db.clients.findByClientId(clientID, scopeOrg, function (err, client) {
      if (err) { return done(err); }
      if (!client) { return done(null, false); }

      var matches = false;

      // For security purposes, we check that redirectURI provided
      // by the client matches one registered with the server.
      _.each(client.get("redirectURIs"), function (value, key, list) {
// TODO - When adding the UI interface to allow redirectURI to be saved to the DB,
// we need to check and make sure they are https URIs.

        // Check if the requested redirectURI is in approved client.redirectURIs.
        if (value.redirectURI && value.redirectURI === redirectURI) {
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
  function (req, res, next) {
    "use strict";

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
  function (req, res, next) {
    "use strict";

    var callback,
        payload = {},
        rootUrl = req.protocol + "://" + req.host + "/",
        routes = require('../routes/routes');

    // Handle the returned scopes list.
    callback = function (result) {
      if (result.isError) {
        return next(new Error("Invalid Request."));
      }

      var client,
        scope,
        scopes = [];

      client = {
        "logo": req.oauth2.client.get("clientLogo"),
        "name": req.oauth2.client.get("clientName")
      };
      scope = req.session.passport.user.organization;

      // Loop through the requested OAuth 2.0 scopes and get the descriptions.
      for (var i = 0; i < req.oauth2.req.scope.length; i++) {
        if (result.data && result.data.oauth2 && result.data.oauth2.scopes &&
          result.data.oauth2.scopes[req.oauth2.req.scope[i]]
          ) {

          // Add the description for this scope to the array to be displayed by dialog.ejs form.
          scopes.push(result.data.oauth2.scopes[req.oauth2.req.scope[i]].description);
        }
      }

      // Render the dialog.ejs form.
      res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user.id, client: client, scope: scope, scopes: scopes });
    };


    if (req.session && req.session.passport && req.session.passport.user && req.session.passport.user.organization) {
      payload.nameSpace = "XT";
      payload.type = "Discovery";
      payload.dispatch = {
        functionName: "getAuth",
        parameters: [null, rootUrl]
      };

      // Get the scopes list from the Discovery Doc.
      routes.queryDatabase("post", payload, req.session, callback);
    } else {
      next(new Error('Invalid OAuth 2.0 scope.'));
    }
  }
];


// user decision endpoint
//
// `decision` middleware processes a user's decision to allow or deny access
// requested by a client application.  Based on the grant type requested by the
// client, the above grant middleware configured above will be invoked to send
// a response.

exports.decision = [
  login.ensureLoggedIn({redirectTo: "/"}),
  server.decision(function (req, next) {
    "use strict";

    // Add the approved scope/org to req.oauth2.res.
    var ares = {};

    if (req.session && req.session.passport && req.session.passport.user && req.session.passport.user.organization) {
      ares.scope = req.session.passport.user.organization;

      // Oauth 2.0 has been approved. Remove it from the session so the user
      // can login to the app normally again.
      delete req.session.oauth2;

      return next(null, ares);
    } else {
      return next(new Error('Invalid OAuth 2.0 scope.'));
    }
  })
];


// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens.  Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request.  Clients must
// authenticate when making requests to this endpoint.

exports.token = [
  passport.authenticate(['basic', 'oauth2-client-password', 'oauth2-jwt-bearer'], { session: false }),
  server.token(),
  server.errorHandler()
];
