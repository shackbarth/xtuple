/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, XT:true, _:true */

(function () {
  "use strict";

  X.resetDbServerPassword = function (user, password) {
    var md5 = X.crypto.createHash('md5'),
      salt = X.options.enhancedAuthKey || "xTuple",
      dbPassword,
      dbServers = [],
      sql = 'alter user "{username}" with password \'{password}\';',
      options = {},
      org;

    // Update password(s) for Postgres user(s)
    options.success = function () {
      var orgOptions = {},
        dbUsername,
        query;

      // Callback to update password on each database server
      orgOptions.success = function () {
        var dbServer = org.getValue("databaseServer.name");

        // Only update this server if we haven't already
        if (!_.contains(dbServers, dbServer)) {
          dbServers.push(dbServer);

          // Encrypt password using Enhanced Authentication technique
          md5.update(password + salt + dbUsername, 'utf8');
          dbPassword = md5.digest('hex');

          query = sql.replace("{username}", dbUsername)
                     .replace("{password}", dbPassword);

          X.database.query(org.get("name"), query);
        }
      };

      // Loop through each organization the user is on and set the password
      _.each(user.get('organizations').models, function (userorg) {
        var name = userorg.get('name');

        org = XM.Organization.findOrCreate(name) ||
          new XM.Organization({ name: name });
        dbUsername = userorg.get('username');
        org.fetch(orgOptions);
      });
    };
    user.fetch(options);
  };
  /**
    Used when a user wants to change their password. They have to verify their old
    password end can enter a new one of their choice.
   */
  exports.changePassword = function (req, res) {
    console.log(req);
    console.log(req.query);
    console.log(JSON.stringify(req.query));
    var nodeUsername = X.options.globalDatabase.nodeUsername,
      args = req.query,
      // the id to change is not taken from the client but from the session on the server
      id = req.session.passport.user.id,
      oldPassword = args.oldPassword,
      newPassword = args.newPassword,
      coll = new XM.UserCollection(),
      user,
      fetchError = function (err) {
        res.semd({isError: true, message: "No user exists by that ID"});
      },
      fetchQuery = {
        "parameters": [
          { attribute: "id", value: id }
        ]
      },
      fetchSuccess = function (collection, result) {
        var updateError = function (model, err) {
            res.send({isError: true, message: "Error updating password"});
          },
          updateSuccess = function () {
            // do not report the password back in plain text to the client. They
            // know what it is, presumably.
            res.send({data: {message: "Password change successful!"}});
          };

        // the actual edit will be made under the authority of the node user

        if (collection.length === 0) {
          // You should not get here.
          return res.send({isError: true, message: "Invalid password"});
        } else if (collection.length > 1) {
          // this should really never happen
          return res.send({isError: true, message: "System error 299.45"});
        } else if (!X.bcrypt.compareSync(oldPassword, result[0].password)) {
          // Check that the old password entered matches what's in the database.
          return res.send({isError: true, message: "Invalid password"});
        } else {
          user = collection.models[0];

          // bcrypt and update password for the global user.
          user.set({password: X.bcrypt.hashSync(newPassword, 10)});
          XT.dataSource.commitRecord(user, {
            success: updateSuccess,
            error: updateError,
            force: true,
            username: nodeUsername
          });

          // Update postgres user passwords
          X.resetDbServerPassword(user, newPassword);
        }
      };

    if (!oldPassword || !newPassword) {
      return res.send({isError: true, reason: "Invalid request"});
    }

    // Verify that the user entered their password correctly by searching for them in the DB
    coll.fetch({query: fetchQuery, success: fetchSuccess, error: fetchError, username: nodeUsername});
  };

}());
