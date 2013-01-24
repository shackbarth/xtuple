/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, XT:true */

(function () {
  "use strict";

  var _fs = X.fs,
    _path = X.path,
    resetPasswordText = "An xTuple administrator has reset your password to %@" +
      ". Please log in at mobile.xtuple.com and change your password by clicking " +
      "the gear icon.",
    newUserText = "Welcome to xTuple! A new account has been created for you, with " +
      "username %@ and password %@. Please log in at mobile.xtuple.com and change " +
      "your password by clicking the gear icon.";

  /**
    Defines the reset password route.
   */

  var sendEmail = function (res, result, newPassword, isNewUser) {
    var emailText = isNewUser ? newUserText.f(result.id, newPassword) : resetPasswordText.f(newPassword),
      emailSubject = isNewUser ? "Welcome to xTuple" : "Password reset",
      mailContent = {
        from: "do-not-reply@xtuple.com",
        to: result.email,
        subject: emailSubject,
        text: emailText
      };

    X.smtpTransport.sendMail(mailContent, function (error, response) {
      if (error) {
        X.log("Reset password email error", error);
        res.send({data: {message: "Error emailing password.", password: newPassword}});
      } else {
        res.send({data: {emailSuccess: true, message: "An email has been sent to " +
          result.email + " with the user's new password."}});
      }
    });
  };

  exports.resetPassword = function (req, res) {
    // TODO: what is the approprate structure of an error report?
    var args = req.query,
      // the fetch and edit will be made under the authority of the requesting global user
      requester = req.session.passport.user,
      user,
      message = "Unknown user or invalid password match",
      fetchSuccess,
      fetchError = function (err) {
        X.log("Cannot load user to reset password. You are probably a hacker.");
        res.send({isError: true, error: "No user exists by that ID"});
      };

    //X.debugging = true;
    //X.debug(data);

    // XXX temp until we get everything on the same port
    res.header("Access-Control-Allow-Origin", "*");

    // TODO: authenticate

    if (!args || !args.id) {
      res.send({isError: true, error: "need an ID"});
    } else {
      user = XM.User.findOrCreate({id: args.id});
      // that should fix this problem:
      //user = XM.User.findOrCreate(args.id);

      //if (user === null) {
        // this bit should not be necessary by my understanding of findOrCreate. Go figure.
        //user = new XM.User({id: args.id});
      //}

      fetchSuccess = function () {
        // thanks http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
        var newPassword = Math.random().toString(36).substr(2, 10),
          updateError = function (model, err) {
            res.send({isError: true, error: "Error updating password"});
          },
          updateSuccess = function (result) {
            sendEmail(res, result, newPassword, args.newUser);
          };

        // bcrypt and update password.
        user.set({password: X.bcrypt.hashSync(newPassword, 10)});

        XT.dataSource.commitRecord(user, {success: updateSuccess, error: updateError, force: true, username: requester});
      };

      user.fetch({success: fetchSuccess, error: fetchError, username: requester});
    }
  };
}());

