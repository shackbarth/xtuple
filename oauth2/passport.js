/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, console:true*/

/**
 * Module dependencies.
 */
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    BasicStrategy = require('passport-http').BasicStrategy,
    ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy,
    BearerStrategy = require('passport-http-bearer').Strategy,
    db = require('./db');


/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use(new LocalStrategy(
  {
    usernameField: 'id',
    passwordField: 'password'
  },
  function (username, password, done) {
    "use strict";

    db.users.findByUsername(username, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false);
      }
      if (!X.bcrypt.compareSync(password, user.get('password'))) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));


/**
 * Set Session Cookie to be returned to the XTPGStore as XM.SessionStore and
 * persist as a valid session to XM.Session in the database.
 */
passport.serializeUser(function (user, done) {
  "use strict";
  var passportUser = {};

  passportUser.id = user.get("id")
  done(null, passportUser);
});


/**
 * Check Session Cookie against the database.
 */
passport.deserializeUser(function (passportUser, done) {
  "use strict";

  db.users.findByUsername(passportUser.id, function (err, user) {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  });
});


/**
 * BasicStrategy & ClientPasswordStrategy
 *
 * These strategies are used to authenticate registered OAuth clients.  They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens.  The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate.  Use of the client password strategy
 * allows clients to send the same credentials in the request body (as opposed
 * to the `Authorization` header).  While this approach is not recommended by
 * the specification, in practice it is quite common.
 */
passport.use(new BasicStrategy(
  function (username, password, done) {
    "use strict";
    db.clients.findByClientId(username, function (err, client) {
      if (err) { return done(err); }
      if (!client) { return done(null, false); }
      if (client.clientSecret !== password) { return done(null, false); }
      return done(null, client);
    });
  }
));

passport.use(new ClientPasswordStrategy(
  function (clientId, clientSecret, done) {
    "use strict";
    db.clients.findByClientId(clientId, function (err, client) {
      if (err) { return done(err); }
      if (!client) { return done(null, false); }
      if (client.clientSecret !== clientSecret) { return done(null, false); }
      return done(null, client);
    });
  }
));

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate users based on an access token (aka a
 * bearer token).  The user must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use(new BearerStrategy(
  function (accessToken, done) {
    "use strict";
    db.accessTokens.find(accessToken, function (err, token) {
      if (err) { return done(err); }
      if (!token) { return done(null, false); }

      db.users.find(token.userID, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        // to keep this example simple, restricted scopes are not implemented,
        // and this is just for illustrative purposes
        var info = { scope: '*' };
        done(null, user, info);
      });
    });
  }
));
