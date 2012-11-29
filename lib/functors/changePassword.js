/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, XT:true */

(function () {
  "use strict";

  var _fs = X.fs, _path = X.path, salt, crypt;

  // TODO: THIS HAS TO CHANGE FOR RELEASE THIS MUST BE GLOBALLY AVAILABLE
  // TO ALL DATASOURCES [ed. note: plural of datasource is datasources]
  salt = _fs.readFileSync(_path.join(X.basePath, X.options.datasource.saltFile), "utf8").trim();

  crypt = function (password) {
    var md5 = X.crypto.createHash('md5');
    md5.update(salt + password);
    return md5.digest('hex');
  };

  /**
    Defines the change password route.

    @extends X.Route
    @class
   */
  X.Functor.create({
    handle: function (xtr, session, callback) {
      var that = this,
        payload = xtr.get("payload").payload,
        parameters = payload.parameters,
        id = session.get("details").id,
        oldPassword = parameters.oldPassword,
        newPassword = parameters.newPassword,
        didChangePassword = function (err, result) {
          if (err) {
            xtr.error(err);
          } else {
            xtr.write({data: {message: "Password change successful!"}}).close();
          }
        },
        coll = new XM.UserCollection(),
        fetchSuccess,
        fetchQuery,
        fetchError = function (err) {
          xtr.error({isError: true, reason: "No user exists by that ID"});
        };

      fetchQuery = {
        "parameters":[{
            attribute: "id",
            value: id
          }, {
            attribute: "password",
            value: crypt(oldPassword)
        }]
      };

      fetchSuccess = function (collection, result) {

        if (collection.length === 0) {
          return xtr.error({isError: true, reason: "Invalid password"});
        } else if (collection.length > 1) {
          // this should really never happen
          return xtr.error({isError: true, reason: "System error 299.45"});
        }
        var user = collection.models[0],
          encryptedNewPassword = crypt(newPassword),
          updateError = function (model, err) {
            console.log("update error");
            xtr.error({isError: true, reason: "Error updating password"});
          },
          updateSuccess = function () {
            console.log("update success");
            xtr.write({data: {message: "Password change successful!"/*, password: newPassword */}}).close();
          };
        user.set({password: encryptedNewPassword});

        XT.dataSource.commitRecord(user, {success: updateSuccess, error: updateError, force: true});
      };

      coll.fetch({query: fetchQuery, success: fetchSuccess, error: fetchError});

    },
    handles: "function/changePassword",
    needsSession: true
  });
}());

