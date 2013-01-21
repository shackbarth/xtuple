/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

  var vows = require('vows'),
      assert = require('assert'),
      zombie = require('zombie');
(function () {
  "use strict";

  vows.describe('Report route').addBatch({
    'a GET to the export route': {
      topic: function () {
        zombie.visit('http://localhost:2000/file?recordType=XM.File&id=40', this.callback);
      },
      'should return some CSV data': function (err, browser, status) {
        console.log(err);

        var body, bodyObj;

        assert(browser.success);
        body = browser.text("body");
        assert(body);
        bodyObj = JSON.parse(body);
        assert.equal(bodyObj.status, "SUCCESS");
      }
    },
  }).export(module);
}());

