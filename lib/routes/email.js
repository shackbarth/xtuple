/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true XM:true */

(function () {
  "use strict";

  var nodemailer = require("nodemailer"),

    _ = X._,
    exec = require('child_process').exec,
    url = require("url"),
    querystring = require("querystring"),
    path = require('path');

  /**

    @extends X.Route
    @class
   */
  X.emailRoute = X.Route.create({

    error: function (session, xtr) {
      //X.warn("error(): ", session.get("error"));
      session.removeAllListeners();
      xtr.error({isError: true, reason: session.get("error")});
    },

    handle: function (xtr) {


      var smtpTransport = nodemailer.createTransport("SMTP", {
        service: "Gmail",
        auth: {
          user: "shackbarth.xtuple@gmail.com",
          pass: "keanureeves"
        }
      });

      var mailOptions = {
        from: "shackbarth.xtuple@gmail.com", // sender address
        to: "shackbarth@xtuple.com", // list of receivers
        subject: "Hello", // Subject line
        text: "Hello world" // plaintext body
      };

      smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
          X.log(error);
        } else {
          X.log("Message sent: " + response.message);
        }
      });

      /*
      var that = this,
        originalUrl = xtr.get("url"),
        cookie = xtr.request.cookies ? xtr.request.cookies.xtsessioncookie : undefined,
        session,
        sessionParams,
        response = xtr.get("response"),
        args = querystring.parse(url.parse(originalUrl).query);
      */

      /*
      if (!cookie) {
        // XXX this still needs some work
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write("You need a valid cookie!");
        response.end();
        return;
      }

      sessionParams = JSON.parse(cookie);
      if (!sessionParams.sid) {
        // XXX this still needs some work
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write("You need a valid cookie!");
        response.end();
        return;
      }

      session = X.Session.create(sessionParams);

      session.once("error", _.bind(this.error, this, session, xtr));

      session.once("isReady", function () {
        // because the session is loaded, session.id is the global username
        that.install(xtr, args, session.id);

      });
      */
    },


    handles: ["email", "/email"]
  });
}());
