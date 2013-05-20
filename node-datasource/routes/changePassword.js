/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, XT:true, _:true */

(function () {
  "use strict";


  var setPassword = function (user, password, callback) {
    var dbPassword, md5, query, salt, sql;

    // Encrypt password using Enhanced Authentication technique
    salt = X.options.datasource.enhancedAuthKey || "xTuple",
    md5 = X.crypto.createHash('md5'),
    sql = 'alter user "{username}" with password \'{password}\';';
    md5.update(req.query.newPassword + salt + username, 'utf8');
    dbPassword = md5.digest('hex');

    query = sql.replace("{username}", username)
               .replace("{password}", dbPassword);
    X.database.query(req.session.passport.user.organization, query, callback);
  };

  // https://localhost/changePassword?oldPassword=password1&newPassword=password2
  exports.changePassword = function (req, res) {
    var testSql = "select relname from pg_class limit 1;",
      username = req.session.passport.user.username,
      options = {
        user: username,
        password: req.query.oldPassword,
        port: X.options.databaseServer.port,
        hostname: X.options.databaseServer.hostname,
        database: req.session.passport.user.organization
      };

    XT.dataSource.query(testSql, options, function (error, result) {

      if (error) {
        // authentication failure
        res.send({isError: true, message: "Invalid password"});
      } else {
        // authentication success
        setPassword(username, req.query.newPassword, function () {
          res.send({data: {message: "Password change successful!"}});
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
      fetchSuccess,
      fetchError = function (err) {
        X.log("Cannot load user to reset password. You are probably a hacker.");
        res.send({isError: true, message: "No user exists by that ID"});
      };

    if (!req.query || !req.query.id) {
      res.send({isError: true, message: "need an ID"});
      return;
    }

    fetchSuccess = function () {
      // Update postgres user passwords
      setPassword(req.query.id, req.query.newPassword, function () {
        res.send({data: {message: "Password change successful!"}});
      });
    };

    user.fetch({success: fetchSuccess, error: fetchError, username: requester});
  };
}());
