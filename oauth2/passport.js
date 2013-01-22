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
    X.debug('Login attempt username: ', username);
    X.debug('Login attempt password: ', password);
    X.debug('Login attempt done: ', done);

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
 // TODO - I'm a little confused here if we need both XM.Session and XM.SessionStore.
 // This could just return done(null, user); and let XM.SessionStore be the only user session object.
passport.serializeUser(function (user, done) {
  "use strict";
  var sessionAttributes = {},
      saveOptions = {},
      generateSID,
      session = {};

  // TODO - Should we move this to X or tools???
  // No real reuse/DRY needs right now, so it stays here.
  generateSID = function () {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
  };

  saveOptions.success = function (model) {
    // Build user object.
    if (model) {
      // Set user session cookie data. Should only include session_sid and session_created for security.
      // It's vitrually impossible to brute force the combination to get a valid session.
      user.sid = model.get("sid");
      user.created = model.get("created");
      // TODO - Commenting out until we get further along in dev.
      // Every thing in user here is stored in the cookie, delete what we don't want to store.
      //delete user.id;
      //delete user.username;
      delete user.password;
      //delete user.name;

      // Return the new user session data for express to use in building the secure session cookie.
      done(null, user);
    }
  };
  saveOptions.error = function (model, err) {
    if (err) {
      // This error should not happen, let's log it to the console.
      console.trace("Session save failed when creating new session for user: ", user.username);

      // This redirects to /login.
      done(null, false);
    }
  };

  // Create new XM.Session object and initialize it.
  session = new XM.Session();
  session.initialize(null, {isNew: true});

  // Set new XM.Session data.
  sessionAttributes = {
    id: user.username,
    sid: generateSID(),
    lastModified: new Date().getTime(),
    created: new Date().getTime()
  };
  // TODO - if username and org add them???
  //username: user.username,
  //organization: user.organization,

  // Save XM.Session to database.
  session.save(sessionAttributes, saveOptions);
});


/**
 * Check Session Cookie against the database.
 */
// TODO - I'm a little confused here if we need both XM.Session and XM.SessionStore.
// If we only use XM.SessionStore, why do we need to check for valid user here again?
passport.deserializeUser(function (user, done) {
  "use strict";
  var fetchOptions = {},
      session = {},
      saveOptions = {};

  // Create new XM.Session object.
  session = new XM.Session();

  saveOptions.success = function (model) {
    // Build user object.
    if (model) {
      // TODO - Where does this data go and what is safe to include?
      // TODO - Do we need the full user/session/org data?
      user.sid = model.get("sid");
      user.created = model.get("created");

      user.username = model.get("id");
    }

    // Return the user data object to express/passport meaning a successful cookie check.
    done(null, user);
  };
  saveOptions.error = function (model, err) {
    if (err) {
      // This error should not happen, let's log it to the console.
      console.trace("Session save failed when updating lastModified timestamp.");

      // This redirects to /login.
      done(null, false);
    }
  };

  fetchOptions.id = user.sid;

  fetchOptions.success = function (model) {
    // Make sure fetch db session matches cookie session_sid and session_created for security.
    if ((model.get("sid") !== user.sid) || (model.get("created") !== user.created)) {
      // If error, assume cookie hacking attempt.

      // TODO - Test this by changing !== to === once user login auth is working
      // from the global database and not passport example db array.

      // Delete this session from db to force new login.
      //X.debug("######### destroy test");
      model.destroy();

      // This redirects to /login.
      done(null, false);
    } else {
      // We have a valid cookie, update lastModified time to extend timeout.
      //X.debug("######### passport session check success");
      model.set("lastModified", new Date().getTime());
      model.save(null, saveOptions);
    }
  };
  fetchOptions.error = function (model, err) {
    if (err) {
      // Session was not found. This can happen if cookie is still in the browser, but
      // db record was removed by CleanupTask because it has timed out.

      // This redirects to /login.
      done(null, false);
    }
  };

  // TODO - We could call the db session CleanupTask here.

  //X.debug("######### passport session check");
  // Try to fetch a session matching the cookie user.sid.
  session.fetch(fetchOptions);
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
