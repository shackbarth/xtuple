/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XT:true, describe:true, it:true, before:true, _:true */

var assert = require("chai").assert,
  emailRoute = require("../../node-datasource/routes/email");

require("../../node-datasource/xt");

(function () {
  "use strict";

  /**
    Test the email route
  */
  describe('Email route', function () {
    it('should adapt datasource inputs to SMTP outputs', function (done) {
      // mock the request
      var req = {
          query: {
            from: "no-reply@xtuple.com",
            to: "gene@xtuple.com",
            subject: "test email",
            text: "Test email body"
          },
          session: {passport: {user: {}}}
        },
        // mock the response object
        res = {
          send: function (result) {
            assert.isUndefined(result.isError);
            assert.equal(result.message, "Email success");
            done();
          }
        };

      // mock the global SMTP variable
      X.smtpTransport = {sendMail: function (content, callback) {
        assert.equal(content.from, "no-reply@xtuple.com");
        assert.equal(content.to, "gene@xtuple.com");
        assert.equal(content.subject, "test email");
        assert.equal(content.text, "Test email body");
        callback();
      }};

      emailRoute.email(req, res);
    });
  });
}());
