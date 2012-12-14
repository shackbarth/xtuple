/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, XT:true */

(function () {
  "use strict";

  var _fs = X.fs, _path = X.path;

  /**
    Used when a user wants to change their password. They have to verify their old
    password end can enter a new one of their choice.

    @extends X.Route
    @class
   */
  X.Functor.create({
    handle: function (xtr, session, callback) {
      var that = this,
        nodeUsername = X.options.globalDatabase.nodeUsername,
        payload = xtr.get("payload").payload,
        parameters = payload.parameters,
        // the id to change is not taken from the client but from the session on the server
        id = session.get("details").id,
        oldPassword = parameters.oldPassword,
        newPassword = parameters.newPassword,
        coll = new XM.UserCollection(),
        fetchError = function (err) {
          xtr.error({isError: true, reason: "No user exists by that ID"});
        },
        fetchQuery = {
          "parameters": [
            { attribute: "id", value: id }
          ]
        },
        fetchSuccess = function (collection, result) {
          // the actual edit will be made under the authority of the node user

          if (collection.length === 0) {
            // You should not get here.
            return xtr.error({isError: true, reason: "Invalid password"});
          } else if (collection.length > 1) {
            // this should really never happen
            return xtr.error({isError: true, reason: "System error 299.45"});
          } else if (!X.bcrypt.compareSync(oldPassword, result[0].password)) {
            // Check that the old password entered matches what's in the database.
            return xtr.error({isError: true, reason: "Invalid password"});
          } else {
            var user = collection.models[0],
                updateError = function (model, err) {
                  xtr.error({isError: true, reason: "Error updating password"});
                },
                updateSuccess = function () {
                  // do not report the password back in plain text to the client. They
                  // know what it is, presumably.
                  xtr.write({data: {message: "Password change successful!"}}).close();
                };

            // bcrypt and update password.
            user.set({password: X.bcrypt.hashSync(newPassword, 10)});
            XT.dataSource.commitRecord(user, {success: updateSuccess, error: updateError, force: true, username: nodeUsername});
          }
        };

      // Verify that the user entered their password correctly by searching for them in the DB
      coll.fetch({query: fetchQuery, success: fetchSuccess, error: fetchError, username: nodeUsername});
    },

    handles: "function/changePassword",
    needsSession: true
  });
}());

