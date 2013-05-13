/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

(function () {
  "use strict";

  var zombieAuth = require("../../vows/lib/zombie_auth"),
    assert = require("chai").assert;
    
  describe('Date Widget', function () {
    this.timeout(10 * 1000);
    var K;
    
    before(function (done) {
      // setup for the date widget
      var initializeDate = function () {
        K = enyo.kind({kind: XV.Date});
        K = new K();
        
        done();
      };
      
      zombieAuth.loadApp(initializeDate);
    });
    
    describe('Test Text to Date', function () {
      // Test known bad dates
      it('Test bad date', function () {
          assert.isFalse(K.textToDate("********"));
          assert.isFalse(K.textToDate("TEST"));
      });
      
    });
    
  }); 

}());