/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, XT:true */

(function () {
  "use strict";

  /**
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
        console.log("callback", error, response);
        if (error) {
          X.log("Email error", error);
          // TODO: coordinate these responses with the callback of the datasource in the client
          res.send(500, "Error emailing");
        } else {
          res.send('{"message": "email success"}');
        }
      };


    // TODO: authentication
    console.log("email route ho!", mailContent);
    X.smtpTransport.sendMail(mailContent, callback);
  };
}());


