/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

  var vows = require('vows'),
      assert = require('assert'),
      zombie = require('zombie');
(function () {
  "use strict";

  vows.describe('a sample vow').addBatch({
    'access top page': {
      topic: function () {
        zombie.visit('http://localhost:2000/login', this.callback);
      },
      'response should be 200 OK': function (err, browser, status){
        console.log(err);
        console.log(browser);
        console.log(status);
        assert.equal(status, 200);
      }
    },
  }).export(module);
}());
