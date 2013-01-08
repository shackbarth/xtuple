/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, XT:true */

(function () {
  "use strict";

  var _fs = X.fs,
    _path = X.path,
    nodemailer = require("nodemailer"),
    resetPasswordText = "An xTuple administrator has reset your password to %@" +
      ". Please log in at mobile.xtuple.com and change your password by clicking " +
      "the gear icon.",
    newUserText = "Welcome to xTuple! A new account has been created for you, with " +
      "username %@ and password %@. Please log in at mobile.xtuple.com and change " +
      "your password by clicking the gear icon.";

  /**
    Defines the reset password route.

    @extends X.Route
    @class
   */
  X.Functor.create({
    handle: function (xtr, session) {
      var that = this,
        data = xtr.get("payload"),
        // the fetch and edit will be made under the authority of the requesting global user
        requester = session.id,
        user,
        message = "Unknown user or invalid password match",
        fetchSuccess,
        fetchError = function (err) {
          X.log("Cannot load user to reset password. You are probably a hacker.");
          xtr.error({isError: true, reason: "No user exists by that ID"});
        };

      //X.debugging = true;
      //X.debug(data);

      if (!data || !data.id) {
        xtr.error({isError: true, reason: "need an ID"});
      } else {
        user = XM.User.findOrCreate(data.payload.id);

        if (user === null) {
          // this bit should not be necessary by my understanding of findOrCreate. Go figure.
          user = new XM.User({id: data.payload.id});
        }

        fetchSuccess = function () {
          // thanks http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
          var newPassword = Math.random().toString(36).substr(2, 10),
            updateError = function (model, err) {
              xtr.error({isError: true, reason: "Error updating password"});
            },
            updateSuccess = function (result) {
              that.sendEmail(xtr, result, newPassword, data.payload.newUser);
            };

          // bcrypt and update password.
          user.set({password: X.bcrypt.hashSync(newPassword, 10)});

          XT.dataSource.commitRecord(user, {success: updateSuccess, error: updateError, force: true, username: requester});
        };

        user.fetch({success: fetchSuccess, error: fetchError, username: requester});
      }
    },

    sendEmail: function (xtr, result, newPassword, isNewUser) {
      var emailText = isNewUser ? newUserText.f(result.id, newPassword) : resetPasswordText.f(newPassword),
        emailSubject = isNewUser ? "Welcome to xTuple" : "Password reset",
        smtpTransport,
        smtpOptions = {
          host: X.options.datasource.smtpHost,
          secureConnection: false,
          port: X.options.datasource.smtpPort
        };

      if (X.options.datasource.smtpUser) {
        smtpOptions.auth = {
          user: X.options.datasource.smtpUser,
          pass: X.options.datasource.smtpPassword
        };
      }
      // TODO: we could save the performance cost of setting up this
      // transport for every e-mail by creating it once at startup
      // and saving it somewhere like X.smtpTransport
      smtpTransport = nodemailer.createTransport("SMTP", smtpOptions);

      var mailOptions = {
        from: "do-not-reply@xtuple.com",
        to: result.email,
        subject: emailSubject,
        text: emailText
      };

      smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
          X.log("Reset password email error", error);
          xtr.write({data: {message: "Error emailing password.", password: newPassword}}).close();
        } else {
          //X.log("Message sent: " + response.message);
          xtr.write({data: {emailSuccess: true, message: "An email has been sent to " + result.email + " with the user's new password."}}).close();
        }
      });

    },

    handles: "function/resetPassword",
    needsSession: true
  });
}());

