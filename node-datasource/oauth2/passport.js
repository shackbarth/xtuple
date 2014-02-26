/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, SYS:true, XT:true, _:true, console:true*/

/**
 * Module dependencies.
 */
var passport = require('passport'),
    Backbone = require('backbone'),
    LocalStrategy = require('./local-strategy'),
    BasicStrategy = require('passport-http').BasicStrategy,
    ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy,
    ClientJWTBearerStrategy = require('passport-oauth2-jwt-bearer').Strategy,
    BearerStrategy = require('passport-http-bearer').Strategy,
    db = require('./db'),
    privateSalt = X.fs.readFileSync(X.options.datasource.saltFile).toString(),
    url = require('url');


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
  function (username, password, database, done) {
    "use strict";
    var model = new SYS.User(),
      error = function (model, error) {
        // authentication failure
        return done(null, false);
      };

    model.fetch({
      id: username,
      error: error,
      username: X.options.databaseServer.user,
      database: database,
      success: function (model, results, successOptions) {
        // inactive users cannot get in
        if (!model.get("isActive")) {
          return done(null, false);
        }
        var query = null;
        var data = null;
        var options = {
          user: X.options.databaseServer.user,
          port: X.options.databaseServer.port,
          hostname: X.options.databaseServer.hostname,
          database: database,
          password: X.options.databaseServer.password

        };

        if (model.get("useEnhancedAuth")) {
          password = X.applyEnhancedAuth(username, password);
        }


        var queryArg = {
          username: username,
          password: password
        };

        // note this function must be owned by a superuser or it will fail
        query = "select xt.check_password($$%@$$);".f(JSON.stringify(queryArg));

        XT.dataSource.query(query, options, function (error, res) {
          if (error) {
            // authentication failure
            return done(null, false);

          } else if (res && res.rows && res.rows.length > 0) {
            // the data comes back in an awkward res.rows[0].request form,
            // and we want to normalize that here so that the data is in response.data
            try {
              data = JSON.parse(res.rows[0].check_password);
              model = false;

              if (data === true) {// authentication success
                model = new Backbone.Model();
                model.set({id: username, organization: database, singleTenant: true});
              }
              return done(null, model);

            } catch (error) {
              return done(null, false);
            }
          }
          return done(null, false);
        });
      }
    });
  }
));


/**
 * Set Session Cookie to be returned to the XTPGStore as SYS.SessionStore and
 * persist as a valid session to XM.Session in the database.
 */
passport.serializeUser(function (user, done) {
  "use strict";

  var passportUser = {};

  passportUser.id = user.get("id");
  if (user.get("singleTenant")) {
    passportUser.username = user.get("id");
    passportUser.organization = user.get("organization");
  }
  done(null, passportUser);
});


/**
 * Check Session Cookie against the database.
 */
passport.deserializeUser(function (passportUser, done) {
  "use strict";

  var model = new Backbone.Model();
  model.set({id: passportUser.id, singleTenant: true});
  return done(null, model);
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
  {
    passReqToCallback: true
  },
  function (req, username, password, done) {
    "use strict";

    var database = url.parse(req.url).path.split("/")[1];

    db.clients.findByClientId(username, database, function (err, client) {
      if (err) { return done(err); }
      if (!client) { return done(null, false); }
      if (client.get("clientSecret") !== password) { return done(null, false); }
      return done(null, client);
    });
  }
));

// TODO: Waiting for merge...
// https://github.com/jaredhanson/passport-oauth2-client-password/pull/1
passport.use(new ClientPasswordStrategy(
  {
    passReqToCallback: true
  },
  function (req, clientId, clientSecret, done) {
    "use strict";

    var database = url.parse(req.url).path.split("/")[1];

    db.clients.findByClientId(clientId, database, function (err, client) {
      if (err) { return done(err); }
      if (!client) { return done(null, false); }
      if (client.get("clientSecret") !== clientSecret) { return done(null, false); }
      return done(null, client);
    });
  }
));


/**
 * JSON Web Token (JWT) Bearer Strategy
 *
 * This strategy authenticates clients using a JWT's Claim Set's "iss" value. The "iss"
 * is extracted from the JWT so a matching client can be looked up.  You do not need
 * to validate the JWT with the signature.  That will be done by the JSON Web Token (JWT)
 * Bearer Token Exchange Middleware for OAuth2orize.  We will just look up a matching
 * client and pass it along to the exhange middleware for full validation.
 */
passport.use(new ClientJWTBearerStrategy(
  {
    passReqToCallback: true
  },
  function (req, claimSetIss, done) {
    "use strict";

    var database = url.parse(req.url).path.split("/")[1];

    db.clients.findByClientId(claimSetIss, database, function (err, client) {
      if (err) { return done(err); }
      if (!client) { return done(null, false); }
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
  {
    passReqToCallback: true
  },
  function (req, accessToken, done) {
    "use strict";

    // Best practice is to use a random salt in each hash. Since we need to query the
    // database for a valid accessToken, we would have to loop through all the hashes
    // and hash the accessToken the client sent using each salt and check for a match.
    // That could take a lot of CPU if there are 1000's of accessToken. Instead, we will
    // not use any salt for this hash. An accessToken is only valid for 1 hour so the
    // risk of cracking the SHA1 hash in that time is small.
    var accesshash = X.crypto.createHash('sha1').update(privateSalt + accessToken).digest("hex"),
        database = url.parse(req.url).path.split("/")[1];

    db.accessTokens.findByAccessToken(accesshash, database, function (err, token) {
      if (err) { return done(err); }
      if (!token) { return done(null, false); }

      // The accessToken is only valid for 1 hour. Has it expired yet?
      if ((new Date(token.get("accessExpires")) - new Date()) < 0) {
        return done(null, false, { message : 'Access token has expired' });
      }

      var tokenUser = token.get("user"),
          tokenScope = JSON.parse(token.get("scope")),
          scopeErr = false,
          scopeOrg = null;

      // If this is a JWT access token, "user" is empty. Try to load the "delegate"
      if (!tokenUser) {
        tokenUser = token.get("delegate");
      }

      // If there are multiple scopes, they should only relate to one org.
      // e.g. [dev.contact, dev.customer, dev.salesorder.readonly] can all be
      // distilled to the "dev" org. Extract a single org from the scopes.
      _.each(tokenScope, function (value, key, list) {
        var scopeParts = value.split(".");

        // TODO - A client should be able to get a token for a userinfo REST call but
        // not have a selected org. This would allow a client not to specify an
        // org scope and then receive an error that includes the URI to call to
        // get a user's scope/org list: 'https://mobile.xtuple.com/auth/userinfo.xxx'
        if (!scopeOrg && (scopeParts[0] !== 'userinfo')) {
          // Get the first part of the scope, which should be the "org".
          // e.g. "toytruck" from "toytruck.contact.readonly"
          scopeOrg = scopeParts[0];
        } else if ((scopeParts[0] !== 'userinfo') && (scopeOrg !== scopeParts[0])) {
          // After the first loop, make sure all the other scopes have the same org.
          // One of the scopes does not match.
          scopeErr = true;
        }
      });

      if (scopeErr) {
        return done(null, false, { message : 'Invalid Request' });
      }

      if (tokenUser) {
        db.users.findByUsername(tokenUser, scopeOrg, function (err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }

          var info = {},
              scopes = token.get("scope");

          try {
            scopes = JSON.parse(scopes);
          } catch (error) {
            if (!Array.isArray(scopes)) { scopes = [ scopes ]; }
          }

          info = { scope: scopes };
          done(null, user, info);
        });
      } else {
        return done(null, false);
      }
    });
  }
));
