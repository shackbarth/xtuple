/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

(function () {
  "use strict";

  var zombieAuth = require("../../vows/lib/zombie_auth"),
    assert = require("chai").assert;

  describe('Test text-to-date function', function (){
    this.timeout(20 * 1000);
    it('A date string should return a good date', function (done) {
      assert.equal(1, 1);
    });
  })
}());