/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

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
        };

      if (payload.functionName !== "updatePassword") {
        // that's the only thing we have set up to work through this functor
        xtr.error({reason: "Not a valid function for the configure functor"});
        return;
      }

      X.proxy.changePassword("user", {id: id, oldPassword: oldPassword, newPassword: newPassword}, didChangePassword);
    },

    handles: "function/configure",

    needsSession: true

  });
}());
