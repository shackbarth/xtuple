/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true, XM:true */

(function () {
  "use strict";

  var passport = require('passport');

  /**
    Receives user authentication credentials and have passport do the authentication.
   */
  exports.login = passport.authenticate('local', { successReturnToOrRedirect: '/login/scope', failureRedirect: '/', failureFlash: 'Invalid username or password.' });

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
  exports.scope = function (req, res) {
    var userId = req.session.passport.user.id,
      selectedOrg = req.body.org,
      userOrgColl = new XM.UserOrganizationCollection(),
      success = function (coll, response) {
        var privs;
        if (response.length === 0) {
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

        // Redirect to start loading the client app.
        res.redirect('/client');
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
  exports.scopeForm = function (req, res) {
    var organizations = [];

    try {
      organizations = _.map(req.user.get("organizations").toJSON(), function (org) {
        return org.name;
      });
    } catch (error) {
      // Prevent unauthorized access.
      res.redirect('/');
      return;
    }

    // Some users may not have any orgs. They should not get this far.
    if (organizations.length === 0) {
      X.err("User: %@ shall not pass, they have no orgs to select.".f(req.session.passport.user.id));
      req.flash('orgerror', 'You have not been assigned any to organizations.');
    }

    // Choose an org automatically if there's only one.
    if (organizations.length === 1) {
      req.body.org = organizations[0];
      exports.scope(req, res);
      return;
    }
    res.render('scope', { organizations: organizations.sort(), message: req.flash('orgerror')  });
  };
}());
