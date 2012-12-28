/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, XT:true */

(function () {
  "use strict";

  var _fs = X.fs,
    _path = X.path,
    nodemailer = require("nodemailer");

  /**
    Defines the reset password route.

    @extends X.Route
    @class
   */
  X.Functor.create({
    handle: function (xtr) {
      var that = this,
        data = xtr.get("payload"),
        user,
        session,
        message = "Unknown user or invalid password match",
        fetchSuccess,
        fetchError = function (err) {
          console.log("fetch error");
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
              that.sendEmail(xtr, result.email, newPassword);
            },
            // the actual edit will be made under the authority of the node user
            nodeUsername = X.options.globalDatabase.nodeUsername;

          // bcrypt and update password.
          user.set({password: X.bcrypt.hashSync(newPassword, 10)});

          XT.dataSource.commitRecord(user, {success: updateSuccess, error: updateError, force: true, username: nodeUsername});
        };

        // XXX might not be necessary to do this fetch
        user.fetch({success: fetchSuccess, error: fetchError});

      }
    },

    sendEmail: function (xtr, emailAddress, newPassword) {
      // TODO: clunky to have to do this for every email
      // TODO: use xtuple SMTP
      // TODO: put credentials in config file
      var smtpTransport = nodemailer.createTransport("SMTP", {
        host: X.options.datasource.xmtpHost,
        secureConnection: false,
        port: X.options.datasource.smtpPort,
        auth: {
          user: X.options.datasource.smtpUser,
          pass: X.options.datasource.smtpPassword
        }
      });

      var mailOptions = {
        from: "do-not-reply@xtuple.com",
        to: emailAddress,
        subject: "Password reset",
        text: "You password has been reset to " + newPassword
      };

      smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
          //X.log(error);
          xtr.write({data: {message: "Error emailing password.", password: newPassword}}).close();
        } else {
          //X.log("Message sent: " + response.message);
          xtr.write({data: {message: "An email has been sent to " + emailAddress + " with the user's new password."}}).close();
        }
      });

    },

    handles: "function/resetPassword",
    needsSession: false
  });
}());

