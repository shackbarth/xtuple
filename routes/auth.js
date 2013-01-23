/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var passport = require('passport')
    , login = require('connect-ensure-login')

  exports.login = passport.authenticate('local', { successReturnToOrRedirect: '/login/scope', failureRedirect: '/' });

  exports.loginForm = function (req, res) {
    res.render('login');
  };

  exports.logout = function (req, res) {
    req.session.passport = null;
    res.clearCookie('connect.sid');
    req.session.destroy(function () {});

    req.logout();
    res.redirect('/');
  }

  exports.scope = function (req, res) {
    var sessionId = req.sessionID,
      userId = req.session.passport.user,
      selectedOrg = req.body.org,
      userOrgColl = new XM.UserOrganizationCollection(),
      success = function (model, response) {
        if (response.length === 0) {
          X.log("User " + userId + " has no business trying to log in to organization " + selectedOrg);
          res.redirect('/');
          return;
        }

        // We can now trust this user's request to log in to this organization

        // update the session store row to add the org choice and username
        req.session.passport.organization = selectedOrg;
        req.session.passport.username = response[0].username;

        res.redirect('/client');
      },
      error = function (model, error) {
        X.log("userorg fetch error", error);
        res.redirect('/');
      },
      query = {
        parameters: [{
          attribute: "user",
          value: userId,
        }, {
          attribute: "name",
          value: selectedOrg
        }]
      };

    //verify that the org is valid for the user
    userOrgColl.fetch({query: query, success: success, error: error});


  }

  exports.scopeForm = function (req, res) {
    var organizations = [];

     try {
       organizations = _.map(req.user.get("organizations").toJSON(), function (org) {return org.name;});
     } catch (error) {
       // prevent unauthorized access
       res.render('login');
     }

    // choose an org automatically if there's only one.
    if (organizations.length === 1) {
      req.body.org = organizations[0];
      exports.scope(req, res);
      return;
    }
    res.render('scopeSubmit', { organizations: organizations });
  };
}());
