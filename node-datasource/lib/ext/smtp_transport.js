/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var nodemailer = require("nodemailer"),
    smtpOptions = {
      host: X.options.datasource.smtpHost,
      secureConnection: X.options.datasource.smtpPort === 465,
      port: X.options.datasource.smtpPort
    };

  // if the smtp server trusts us we don't need any authentication, so
  // don't send any if it's not in our configuration
  if (X.options.datasource.smtpUser) {
    smtpOptions.auth = {
      user: X.options.datasource.smtpUser,
      pass: X.options.datasource.smtpPassword
    };
  }

  X.smtpTransport = nodemailer.createTransport("SMTP", smtpOptions);

}());
