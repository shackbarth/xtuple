/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

  var vows = require('vows'),
      assert = require('assert'),
      zombieAuth = require('./zombie_auth'),
      zombie = require('zombie');
(function () {
  "use strict";

  vows.describe('Report route').addBatch({
    'accessing the report route': {
      topic: function () {
        zombie.visit('http://localhost:2000/report?details={json:true}', this.callback);
      },
      'should send us to Pentaho': function (err, browser, status){
        assert(browser.success);
        assert.equal(browser.location.host, "maxhammer.xtuple.com:8080");
        assert.equal(browser.text("title"), "Report Web Viewer"); // that's pentaho's title
      }
    },
  }).export(module);
}());
