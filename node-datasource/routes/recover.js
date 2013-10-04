/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true, SYS:true */

(function () {
  "use strict";


  var recoverEmailText = "You have requested to reset your xTuple password. " +
      " Please follow this secure link to reset your password: \n" +
      "https://%@/%@/recover/reset/%@/%@\n\n" +
      "Thanks,\n The xTuple Team",
    systemErrorMessage = "Password change unsuccessful.",
    setPassword = require('./change_password').setPassword,
    async = require('async'),
    utils = require('../oauth2/utils');

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
      successMessage = "An email has been sent with password recovery instructions",
      error = function () {
        res.render('forgot_password', { message: [systemErrorMessage], databases: X.options.datasource.databases });
      };

    if (!database || X.options.datasource.databases.indexOf(database) < 0) {
      // don't show our hand
      error();
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
      error: error,
      success: function (collection, results, options) {
        var recoverModel = new SYS.Recover(),
          setRecovery;

        if (!results || results.length === 0) {
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
            now = new Date(),
            tomorrow = new Date(now.getTime() + 1000 * 60 * 60 * 24),
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
              X.smtpTransport.sendMail(mailContent, function (err) {
                //
                // We've sent out the email. Now return to the user
                //
                if (err) {
                  error();
                  return;
                }
                res.render('forgot_password', { message: [successMessage],
                  databases: X.options.datasource.databases });
              });
            };

          X.bcrypt.hash(uuid, 12, function (err, uuidHash) {
            if (err) {
              error();
              return;
            }
            var attributes = {
              recoverUsername: results[0].username,
              hashedToken: uuidHash,
              accessed: false,
              reset: false,
              createdTimestamp: now,
              expiresTimestamp: tomorrow
            };

            recoverModel.set(attributes);
            recoverModel.save(null, {
              database: database,
              username: X.options.databaseServer.user,
              success: saveSuccess,
              error: error
            });
          });
        };
        recoverModel.on('change:id', setRecovery);
        recoverModel.initialize(null, {isNew: true, database: database});
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
    var recoveryModel,
      userModel,
      //
      // Make sure the user typed the password in twice the same
      //
      verifyPasswords = function (callback) {
        if (req.body.password !== req.body.password2) {
          callback("PASSWORD_MISMATCH");
        } else {
          callback();
        }
      },
      //
      // We get the id and the unencrypted token from the session.
      // Make sure that the token checks out to that id in the database.
      //
      fetchRecoveryModel = function (callback) {
        recoveryModel = new SYS.Recover();
        recoveryModel.fetch({
          id: req.session.recover.id,
          database: req.params.org,
          username: X.options.databaseServer.user,
          error: callback, // first arg is error in both paradigms
          success: function () {
            callback();
          }
        });
      },
      verifyRecoveryModel = function (callback) {
        X.bcrypt.compare(req.session.recover.token, recoveryModel.get("hashedToken"), function (err, compare) {
          var now = new Date();

          if (err ||
              !compare ||
              !recoveryModel.get("accessed") ||
              recoveryModel.get("reset") ||
              recoveryModel.get("ip") !== req.connection.remoteAddress ||
              now.getTime() > recoveryModel.get("expiresTimestamp").getTime()) {

            callback(true); // error
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
            error: callback, // first arg is error in both paradigms
            success: function () {
              callback();
            }
          });
        });
      },
      //
      // Update the user's password AFTER we've verified and disabled the
      // recovery object
      //
      fetchUserModel = function (callback) {
        userModel = new SYS.User();
        userModel.fetch({
          id: recoveryModel.get("recoverUsername"),
          database: req.params.org,
          username: X.options.databaseServer.user,
          error: callback, // first arg is error in both paradigms
          success: function () {
            callback();
          }
        });
      },
      updateUserPassword = function (callback) {
        setPassword(recoveryModel.get("recoverUsername"),
          req.body.password,
          req.params.org,
          userModel.get("useEnhancedAuth"),
          callback);
      },
      //
      // Send a response back to the user, either:
      // -They did not type the same password twice
      // -Some other error (which should not happen, so be guarded about the response)
      // -Success
      //
      renderResponse = function (err, results) {
        if (err === "PASSWORD_MISMATCH") {
          res.render('reset_password', {message: ["Passwords do not match"]});
        } else if (err) {
          res.render('forgot_password', { message: [systemErrorMessage], databases: X.options.datasource.databases });
        } else {
          //
          // The password has been updated. Redirect the user to the login screen.
          //
          res.render('login', {
            message: ["Your password has been updated. Please log in."],
            databases: X.options.datasource.databases
          });
        }
      };

    async.series([
      verifyPasswords,
      fetchRecoveryModel,
      verifyRecoveryModel,
      fetchUserModel,
      updateUserPassword
    ], renderResponse);

  };
}());
