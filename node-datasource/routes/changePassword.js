/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, XT:true, _:true */

(function () {
  "use strict";


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
      var dbPassword, md5, query, salt, sql;

      if (error) {
        // authentication failure
        res.send({isError: true, message: "Invalid password"});
      } else {
        // authentication success

        // Encrypt password using Enhanced Authentication technique
        salt = X.options.datasource.enhancedAuthKey || "xTuple",
        md5 = X.crypto.createHash('md5'),
        sql = 'alter user "{username}" with password \'{password}\';';
        md5.update(req.query.newPassword + salt + username, 'utf8');
        dbPassword = md5.digest('hex');

        query = sql.replace("{username}", username)
                   .replace("{password}", dbPassword);
        X.database.query(req.session.passport.user.organization, query, function () {
          res.send({data: {message: "Password change successful!"}});
        });
      }
    });
  };
}());
