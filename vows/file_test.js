/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

  var vows = require('vows'),
      assert = require('assert'),
      zombie = require('zombie');
(function () {
  "use strict";

  // this doesn't work anymore now that we authenticate
  vows.describe('Report route').addBatch({
    'a GET to the file route': {
      topic: function () {
        var host = "localhost:2000";
        //var host = "localtest.com";
        zombie.visit('http://' + host + '/file?recordType=XM.File&id=10', this.callback);
      },
      'should return some data': function (err, browser, status) {
        //console.log(err);
        //assert(browser.success);
        console.log(browser.text("body"));
        //assert(browser.text("body"));
        assert(!JSON.parse(browser.text("body")).isError);
      }
    }
  }).export(module);
}());

