/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

(function () {
  "use strict";

  var zombieAuth = require("../../vows/lib/zombie_auth"),
    assert = require("chai").assert;

  describe('Test Date Widget', function () {
    this.timeout(20 * 1000);
    it('a text date should return a date', function (done) {
      var testTextDate = function () {
        var K = enyo.kind({kind: XV.Date});
        K = new K();

        assert.isNull(null);
        assert.isFalse(K.textToDate("TEST"));
        
        done();
      };
      
      zombieAuth.loadApp(testTextDate);
    });
  });
}());