/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true, SYS:true */

(function () {
  "use strict";


  var recoverEmailText = "Follow this secure link to reset your password: " +
    "https://%@/%@/recover/reset/%@/%@";
  var systemErrorMessage = "A system error occurred. I'm very sorry about this, but I can't give " +
    "you any more details because I'm very cautious about security and this is a sensitive topic.";

  /**
    @name Auth
    @class Auth
    */
  var passport = require('passport'),
      url = require('url'),
      setPassword = require('./change_password').setPassword,
      utils = require('../oauth2/utils');

  /**
    Receives user authentication credentials and have passport do the authentication.
   */
  exports.login = [
    //passport.authenticate('local', { successReturnToOrRedirect: '/login/scope', failureRedirect: '/', failureFlash: 'Invalid username or password.' }),
    passport.authenticate('local', { failureRedirect: '/?login=fail' }),
    function (req, res, next) {

      if (req && req.session && !req.session.oauth2 && req.session.passport && req.session.passport.user && req.session.passport.user.organization) {
        res.redirect("/" + req.session.passport.user.organization + '/app');
        //next();
      } else {
        exports.scopeForm(req, res, next);
      }
    }
  ];

  /**
    Renders the login form
   */
  exports.loginForm = function (req, res) {
    var message = [];

    if (req.query && req.query.login && req.query.login === 'fail') {
      message = ["Invalid username or password."];
    }

    res.render('login', { message: message, databases: X.options.datasource.databases });
  };

  /**
    Renders the "forgot password?" form
  */
  exports.forgotPasswordForm = function (req, res) {
    res.render('forgot_password', { message: [], databases: X.options.datasource.databases });
  };

  /**
    Create a row in the recover table, and send an email to the user with the token
    whose hash is stored in the row, as well as the id to the row.
   */
  exports.recoverPassword = function (req, res) {
    var userCollection = new SYS.UserCollection(),
      email = req.body.email,
      database = req.body.database,
      errorMessage = "Cannot find email address",
      successMessage = "An email has been sent with password recovery instructions";

    if (!database || X.options.datasource.databases.indexOf(database) < 0) {
      // don't show our hand
      res.render('forgot_password', { message: [errorMessage], databases: X.options.datasource.databases });
      return;
    }

    //
    // Find a user with the inputted email address. Make sure only one result is found.
    //
    userCollection.fetch({
      query: {
        parameters: [{
          attribute: "email",
          value: email
        }]
      },
      database: database,
      username: X.options.databaseServer.user,
      success: function (collection, results, options) {
        var recoverModel = new SYS.Recover(),
          setRecovery;

        if (results.length === 0) {
          // XXX Ben recommends we don't show our hand here.
          res.render('forgot_password', { message: [errorMessage], databases: X.options.datasource.databases });
          return;
        } else if (results.length > 1) {
          // quite a quandary
          // errorMessage = "Wasn't expecting to see multiple users with this email address";
          res.render('forgot_password', { message: [systemErrorMessage], databases: X.options.datasource.databases });
          return;
        }
        setRecovery = function () {
          //
          // We've initialized our recovery model. Now set and save it.
          //
          var uuid = utils.generateUUID(),
            id = recoverModel.get("id"),
            uuidHash = X.bcrypt.hashSync(uuid, 12),
            now = new Date(),
            tomorrow = new Date(now.getTime() + 1000 * 60 * 60 * 24),
            attributes = {
              recoverUsername: results[0].username,
              hashedToken: uuidHash,
              accessed: false,
              reset: false,
              createdTimestamp: now,
              expiresTimestamp: tomorrow
            },
            saveSuccess = function () {
              //
              // We've saved our recovery model. Now send out an email.
              //
              var mailContent = {
                from: "no-reply@xtuple.com",
                to: email,
                subject: "xTuple password reset instructions",
                text: recoverEmailText.f(req.headers.host, database, id, uuid)
              };
              // XXX: don't log this
              console.log(mailContent);
              X.smtpTransport.sendMail(mailContent, function (err) {
                //
                // We've sent out the email. Now return to the user
                //
                if (err) {
                  res.render('forgot_password', { message: [systemErrorMessage],
                    databases: X.options.datasource.databases });
                  return;
                }
                res.render('forgot_password', { message: [successMessage],
                  databases: X.options.datasource.databases });
              });
            },
            saveError = function () {
              res.render('forgot_password', { message: [errorMessage], databases: X.options.datasource.databases });
            };

          recoverModel.set(attributes);
          recoverModel.save(null, {
            database: database,
            username: X.options.databaseServer.user,
            success: saveSuccess,
            error: saveError
          });
        };
        recoverModel.on('change:id', setRecovery);
        recoverModel.initialize(null, {isNew: true, database: database});
      },
      error: function () {
        res.render('forgot_password', { message: [errorMessage], databases: X.options.datasource.databases });
      }
    });
  };

  /**
    Validates the link that the user clicks on when they receive their email.
    The token in the URL should hash to the hashed value in the table row
    specified by the ID of the email. If everything checks out, forward them
    to a screen to reset their password.
   */
  exports.verifyRecoverPassword = function (req, res) {
    var error = function () {
        res.render('forgot_password', { message: [systemErrorMessage], databases: X.options.datasource.databases });
      },
      recoveryModel = new SYS.Recover();

    //
    // We get the id and the unencrypted token from the URL. Make sure that the token checks out
    // to that id in the database.
    //
    recoveryModel.fetch({
      id: req.params.id,
      database: req.params.org,
      username: X.options.databaseServer.user,
      success: function (model, result, options) {
        var now = new Date();

        X.bcrypt.compare(req.params.token, model.get("hashedToken"), function (err, compare) {
          if (err ||
              !compare ||
              model.get("accessed") ||
              model.get("reset") ||
              now.getTime() > model.get("expiresTimestamp").getTime()) {

            // TODO: get the paths straight
            res.render('forgot_password', { message: [systemErrorMessage], databases: X.options.datasource.databases });
            return;
          }

          //
          // This is a valid recovery model. Update it as accessed, and
          // set recovery variables in the user's session.
          //
          req.session.recover = {
            id: req.params.id,
            token: req.params.token
          };
          recoveryModel.set({
            accessed: true,
            accessedTimestamp: now,
            expiresTimestamp: new Date(now.getTime() + 1000 * 60 * 15), // 15 minutes
            ip: req.connection.remoteAddress
          });
          recoveryModel.save(null, {
            database: req.params.org,
            username: X.options.databaseServer.user,
            error: error,
            success: function (model, result, options) {
              res.render('reset_password', {message: []});
            }
          });
        });
      },
      error: error
    });
  };

  /**
    Handles the form submission to reset the password. Makes sure that the session is
    the same one that we recently validate by re-validating. If everything checks out,
    disable the validation row (by setting reset:true), update the user's password,
    and redirect to the login page.
   */
  exports.resetRecoveredPassword = function (req, res) {
    var error = function () {
        res.render('forgot_password', { message: [systemErrorMessage], databases: X.options.datasource.databases });
      },
      recoveryModel = new SYS.Recover();

    if (req.body.password !== req.body.password2) {
      res.render('reset_password', {message: ["Passwords do not match"]});
      return;
    }
    //
    // We get the id and the unencrypted token from the session.
    // Make sure that the token checks out to that id in the database.
    //
    recoveryModel.fetch({
      id: req.session.recover.id,
      database: req.params.org,
      username: X.options.databaseServer.user,
      success: function (model, result, options) {
        var now = new Date();

        X.bcrypt.compare(req.session.recover.token, model.get("hashedToken"), function (err, compare) {
          if (err ||
              !compare ||
              !model.get("accessed") ||
              model.get("reset") ||
              model.get("ip") !== req.connection.remoteAddress ||
              now.getTime() > model.get("expiresTimestamp").getTime()) {

            // TODO: get the paths straight
            res.render('forgot_password', { message: [systemErrorMessage], databases: X.options.datasource.databases });
            return;
          }

          //
          // This is a valid recovery model. Update it as reset.
          //
          recoveryModel.set({
            reset: true,
            resetTimestamp: now
          });
          recoveryModel.save(null, {
            database: req.params.org,
            username: X.options.databaseServer.user,
            error: error,
            success: function (model, result, options) {
              var userModel = new SYS.User();
              userModel.fetch({
                id: model.get("recoverUsername"),
                database: req.params.org,
                username: X.options.databaseServer.user,
                error: error,
                success: function (model, result, options) {
                  //
                  // NOW we update the user's password
                  //
                  setPassword(recoveryModel.get("recoverUsername"),
                    req.body.password,
                    req.params.org,
                    model.get("useEnhancedAuth"),
                    function (err) {
                      if (err) {
                        error();
                        return;
                      }
                      //
                      // The password has been updated. Redirect the user to the login screen.
                      //
                      // TODO: get the path right
                      res.render('login', {
                        message: ["Your password has been updated. Please log in."],
                        databases: X.options.datasource.databases
                      });
                    }
                  );
                }
              });
            }
          });
        });
      }
    });
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

    if (req.path.split("/")[1]) {
      res.clearCookie(req.path.split("/")[1] + ".sid");
    }

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
      user = new SYS.User(),
      options = {};

    options.success = function (response) {
      var privs,
          userOrg,
          userName;

      if (response.length === 0) {
        if (req.session && req.session.oauth2 && req.session.oauth2.redirectURI) {
          X.log("OAuth 2.0 User %@ has no business trying to log in to organization %@.".f(userId, selectedOrg));
          res.redirect(req.session.oauth2.redirectURI + '?error=access_denied');
          return;
        }

        X.log("User %@ has no business trying to log in to organization %@.".f(userId, selectedOrg));
        res.redirect('/' + selectedOrg + '/logout');
        return;
      } else if (response.length > 1) {
        X.log("More than one User: %@ exists.".f(userId));
        res.redirect('/' + selectedOrg + '/logout');
        return;
      }

      // We can now trust this user's request to log in to this organization.

      // Update the session store row to add the org choice and username.
      // Note: Updating this object magically persists the data into the SessionStore table.

      //privs = _.map(response.get("privileges"), function (privAss) {
      //  return privAss.privilege.name;
      //});

      //_.each(response.get('organizations'), function (orgValue, orgKey, orgList) {
      //  if (orgValue.name === selectedOrg) {
      //    userOrg = orgValue.name;
      //    userName = orgValue.username;
      //  }
      //});

      //if (!userOrg || !userName) {
      if (!response.get("username")) {
        // This shouldn't happen.
        X.log("User %@ has no business trying to log in to organization %@.".f(userId, selectedOrg));
        res.redirect('/' + selectedOrg + '/logout');
        return;
      }

      //req.session.passport.user.globalPrivileges = privs;
      req.session.passport.user.organization = response.get("organization");
      req.session.passport.user.username = response.get("username");

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
        res.redirect('/' + selectedOrg + '/app');
      }
    };

    options.error = function (model, error) {
      X.log("userorg fetch error", error);
      res.redirect('/' + selectedOrg + '/logout');
      return;
    };


    // The user id we're searching for.
    options.id = userId;

    // The user under whose authority the query is run.
    options.username = X.options.databaseServer.user;
    options.database = selectedOrg;

    // Verify that the org is valid for the user.
    user.fetch(options);
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
          org = scope.path.split("/")[1] || null;

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
