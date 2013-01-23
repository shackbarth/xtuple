/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

  var vows = require('vows'),
      assert = require('assert'),
      zombie = require('zombie');
(function () {
  "use strict";

  vows.describe('Report route').addBatch({
    'a GET to the file route': {
      topic: function () {
        zombie.visit('http://localhost:2000/file?recordType=XM.File&id=1', this.callback);
      },
      'should return some data': function (err, browser, status) {
        assert(browser.success);
        assert(browser.text("body"));
      }
    }
  }).export(module);
}());

