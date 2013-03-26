/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true, XM:true */

(function () {
  "use strict";

  var passport = require('passport'),
      url = require('url');

  /**
    Receives user authentication credentials and have passport do the authentication.
   */
  exports.login = [
    //passport.authenticate('local', { successReturnToOrRedirect: '/login/scope', failureRedirect: '/', failureFlash: 'Invalid username or password.' }),
    passport.authenticate('local', { failureRedirect: '/', failureFlash: 'Invalid username or password.' }),
    function (req, res, next) {
      exports.scopeForm(req, res, next);
    }
  ];

  /**
    Renders the login form
   */
  exports.loginForm = function (req, res) {
    res.render('login', { message: req.flash('error') });
  };

  /**
    Logs out user by removing the session and sending the user to the login screen.
   */
  exports.logout = function (req, res) {
    if (req.session.passport) {
      // Make extra sure passport is empty.
      req.session.passport = null;
    }

    if (req.session) {
      // Kill the whole session, db, cache and all.
      req.session.destroy(function () {});
    }

    res.clearCookie('connect.sid');

    req.logout();
    res.redirect('/');
  };

  /**
    Receives a request telling us which organization a user has selected
    to log into. Note that we don't trust the client; we check
    to make sure that the user actually belongs to that organization.
   */
  exports.scope = function (req, res, next) {
    var userId = req.session.passport.user.id,
      selectedOrg = req.body.org,
      userOrgColl = new XM.UserOrganizationCollection(),
      success = function (coll, response) {
        var privs;
        if (response.length === 0) {
          if (req.session && req.session.oauth2 && req.session.oauth2.redirectURI) {
            X.log("OAuth 2.0 User %@ has no business trying to log in to organization %@.".f(userId, selectedOrg));
            res.redirect(req.session.oauth2.redirectURI + '?error=access_denied');
            return;
          }

          X.log("User %@ has no business trying to log in to organization %@.".f(userId, selectedOrg));
          res.redirect('/logout');
          return;
        }

        // We can now trust this user's request to log in to this organization.

        // Update the session store row to add the org choice and username.
        // Note: Updating this object magically persists the data into the SessionStore table.

        privs = _.map(coll.models[0].getValue("user.privileges").models, function (privAss) {
          return privAss.getValue("privilege.name");
        });
        req.session.passport.user.globalPrivileges = privs;
        req.session.passport.user.organization = response[0].name;
        req.session.passport.user.username = response[0].username;

// TODO - req.oauth probably isn't enough here, but it's working 2013-03-15...
        // If this is an OAuth 2.0 login with only 1 org.
        if (req.oauth2) {
          return next();
        }

        // If this is an OAuth 2.0 login with more than 1 org.
        if (req.session.returnTo) {
          res.redirect(req.session.returnTo);
        } else {
          // Redirect to start loading the client app.
          res.redirect('/client');
        }
      },
      error = function (model, error) {
        X.log("userorg fetch error", error);
        res.redirect('/logout');
        return;
      },
      query = {
        parameters: [{
          attribute: "user",
          value: userId
        }, {
          attribute: "name",
          value: selectedOrg
        }]
      };

    // Verify that the org is valid for the user.
    userOrgColl.fetch({ query: query, success: success, error: error });
  };

  /**
    Loads the form to let the user choose their organization. If there's only one
    organization for the user we choose for them.
   */
  exports.scopeForm = function (req, res, next) {
    var organizations = [],
        scope,
        scopes = [];

    try {
      organizations = _.map(req.user.get("organizations"), function (org) {
        return org.name;
      });
    } catch (error) {
      // Prevent unauthorized access.
      res.redirect('/');
      return;
    }

    // If this is an OAuth 2.0 login req, try and get the org from the requested scope.
    if (req.session && req.session.oauth2) {

      if (req.session.oauth2.req && req.session.oauth2.req.scope && req.session.oauth2.req.scope.length > 0) {
        // Loop through the scope URIs and convert them to org names.
        _.each(req.session.oauth2.req.scope, function (value, key, list) {
          var org;

          // Get the org from the scope URI e.g. 'dev' from: 'https://mobile.xtuple.com/auth/dev'
          scope = url.parse(value, true);
          org = scope.path.match(/\/auth\/(.*)/)[1] || null;

          // TODO - Still need more work to support userinfo calls.
          // See node-datasource/oauth2/oauth2.js authorization.

          // The scope 'https://mobile.xtuple.com/auth/userinfo.xxx' can be used to make userinfo
          // REST calls and is not a valid org scope, we'll skip it here.
          if (org && org.indexOf('userinfo') === -1) {
            scopes[key] = org;
          }
        });

        // If we only have one scope/org sent, choose it for this request.
        if (scopes.length === 1) {
          req.body.org = scopes[0];
          exports.scope(req, res, next);
          return;
        }

        // TODO - Multiple scopes sent.
        // Do we want to let them select an org or respond with error and scopeList?
        // It depends on the scenario. Some support user interaction and can select an org, others
        // do not and should get an error.

      }

      // TODO - No scope is sent.
      // Do we want to let them select an org or respond with error and scopeList?
      // It depends on the scenario. Some support user interaction and can select an org, others
      // do not and should get an error.

    }

    // Below will handle OAuth "TODO - Multiple scopes sent", "TODO - No scope is sent." above for now.

    // Choose an org automatically if there's only one for this user.
    if (organizations.length === 1) {
      req.body.org = organizations[0];
      exports.scope(req, res, next);
      return;
    }

    // Some users may not have any orgs. They should not get this far.
    if (organizations.length === 0) {
      X.err("User: %@ shall not pass, they have no orgs to select.".f(req.session.passport.user.id));
      req.flash('orgerror', 'You have not been assigned to any organizations.');
    }

    // We've got nothing, let the user choose their scope/org.
    res.render('scope', { organizations: organizations.sort(), message: req.flash('orgerror') });
  };
}());
