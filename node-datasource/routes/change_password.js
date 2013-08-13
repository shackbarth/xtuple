/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, SYS:true, XT:true, _:true */

(function () {
  "use strict";

  /*
    Encrypt password using Enhanced Authentication technique
   */
  X.applyEnhancedAuth = function (username, password) {
    var md5, salt;

    salt = X.options.datasource.enhancedAuthKey || "xTuple";
    md5 = X.crypto.createHash('md5');
    md5.update(password + salt + username, 'utf8');
    return md5.digest('hex');
  };

  var setPassword = exports.setPassword = function (username, password, organization, useEnhancedAuth, callback) {
    var query, queryArg, queryOptions;

    if (useEnhancedAuth) {
      password = X.applyEnhancedAuth(username, password);
    }
    queryArg = {
      username: username,
      password: password
    };
    query = "select xt.change_password($$%@$$);".f(JSON.stringify(queryArg));

    queryOptions = XT.dataSource.getAdminCredentials(organization);
    XT.dataSource.query(query, queryOptions, callback);
  };

  // https://localhost/changePassword?oldPassword=password1&newPassword=password2
  exports.changePassword = function (req, res) {
    var model = new SYS.User(),
      organization = req.session.passport.user.organization,
      username = req.session.passport.user.username,
      error = function () {
        console.log("change password error", arguments);
      };

    // we need to first fetch the user to see if they use enhanced auth
    model.fetch({
      id: username,
      error: error,
      username: X.options.databaseServer.user,
      database: organization,
      success: function (model, results, successOptions) {
        var testSql = "select relname from pg_class limit 1;",
          useEnhancedAuth = model.get("useEnhancedAuth"),
          password = req.query.oldPassword,
          options = {
            user: username,
            port: X.options.databaseServer.port,
            hostname: X.options.databaseServer.hostname,
            database: organization
          };

        if (useEnhancedAuth) {
          password = X.applyEnhancedAuth(username, password);
        }
        options.password = password;

        // the test sql will verify their old password
        XT.dataSource.query(testSql, options, function (error, result) {
          if (error) {
            // authentication failure
            res.send({isError: true, message: "Invalid password"});
          } else {
            // authentication success
            setPassword(username, req.query.newPassword, organization, useEnhancedAuth, function () {
              res.send({data: {message: "Password change successful!"}});
            });
          }
        });
      }
    });
  };

  /**
    Resets a user's password. Anyone with MaintainUsers has the authority to do this.
    First fetching the user is a simple way to ensure permissions.
   */
  exports.resetPassword = function (req, res) {
    // the fetch and edit will be made under the authority of the requesting user
    var requester = req.session.passport.user.id,
      user,
      fetchSuccess,
      organization = req.session.passport.user.organization,
      fetchError = function (err) {
        X.log("Cannot load user to reset password. You are probably a hacker.");
        res.send({isError: true, message: "No user exists by that ID"});
      };

    if (!req.query || !req.query.id) {
      res.send({isError: true, message: "need an ID"});
      return;
    }

    user = new SYS.User();
    fetchSuccess = function (model) {
      var useEnhancedAuth = model.get("useEnhancedAuth");
      setPassword(req.query.id, req.query.newPassword, organization, useEnhancedAuth, function () {
        res.send({data: {message: "Password change successful!"}});
      });
    };

    user.fetch({
      id: req.query.id,
      success: fetchSuccess,
      error: fetchError,
      database: req.session.passport.user.organization,
      username: requester
    });
  };
}());
