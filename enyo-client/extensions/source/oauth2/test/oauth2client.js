/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require("../../../../xtuple/node-datasource/test/mocha/lib/crud"),
    assert = require("chai").assert;

  var data = exports.data = {
      recordType: "XM.Oauth2client",
      autoTestAttributes: true,
      createHash: {
        clientID: "my_id_" + Math.random(),
        clientSecret: "mostlysecret",
        clientName: "Snowden",
        clientEmail: "client@oau.th",
        clientType: "web server"
      },
      updateHash: {
        clientSecret: "topsecret"
      }
    };

  describe('Oauth2client crud test', function () {
    this.timeout(20 * 1000);
    it('should perform all the crud operations', function (done) {
      crud.runAllCrud(data, done);
    });
  });
}());
