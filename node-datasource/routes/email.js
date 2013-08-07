/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, XT:true */

(function () {
  "use strict";

  /**
    @name Email
    @class Email
    Defines the email route. Anyone with appropriate permissions can use this
    to easily send emails out of the node layer.
   */
  exports.email = function (req, res) {
    var args = req.query,
      mailContent = {
        from: args.from,
        replyTo: args.replyTo,
        to: args.to,
        cc: args.cc,
        bcc: args.bcc,
        subject: args.subject,
        text: args.text
      },
      callback = function (error, response) {
        if (error) {
          X.log("Email error", error);
          res.send({isError: true, message: "Error emailing"});
        } else {
          res.send({message: "Email success"});
        }
      };

    X.smtpTransport.sendMail(mailContent, callback);
  };
}());
