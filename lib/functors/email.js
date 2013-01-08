/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, XT:true */

(function () {
  "use strict";

  /**
    Defines the email route. Anyone with appropriate permissions can use this
    to easily send emails out of the node layer.

    @extends X.Route
    @class
   */
  X.Functor.create({

    handle: function (xtr, session) {
      var data = xtr.get("payload").payload,
        mailContent = {
          from: data.fromAddress,
          to: data.toAddress,
          subject: data.subject,
          text: data.text
        },
        callback = function (error, response) {
          if (error) {
            X.log("Email error", error);
            xtr.error({isError: true, reason: "Error emailing"});
          } else {
            xtr.write({data: {message: "Email success"}}).close();
          }
        };

      X.smtpTransport.sendMail(mailContent, callback);
    },

    handles: "function/email",

    // XXX: I believe that this is sufficient to at least ensure that the user
    // exists and is logged in. We'll be moving to express security soon.
    needsSession: true
  });
}());


