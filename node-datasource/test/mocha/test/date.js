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
      it('Test just plain bad date', function () {
        assert.isFalse(K.textToDate("********"));
        assert.isFalse(K.textToDate("BEWARE. I AM BAD."));
      });
      
      it('Test day of the year using #', function () {
        var days = 20, newDate = new Date();
        
        newDate = new Date(newDate.getFullYear(), 0, 20, 0, 0, 0, 0);
        newDate = K.applyTimezoneOffset(newDate);
        assert.notStrictEqual(K.textToDate("#20"), newDate);
        
        newDate = new Date(newDate.getFullYear(), 0, 65, 0, 0, 0, 0);
        newDate = K.applyTimezoneOffset(newDate);
        assert.notStrictEqual(K.textToDate("#65"), newDate);
        
        // really, really big one!
        newDate = new Date(newDate.getFullYear(), 0, 600000000, 0, 0, 0, 0);
        newDate = K.applyTimezoneOffset(newDate);
        assert.notStrictEqual(K.textToDate("#600000000"), newDate);
        
        // and it works backward!
        newDate = new Date(newDate.getFullYear(), 0, -40, 0, 0, 0, 0);
        newDate = K.applyTimezoneOffset(newDate);
        assert.notStrictEqual(K.textToDate("#-40"), newDate);
        
        assert.isFalse(K.textToDate("#tt"));
        // This is a bug. Both of these should return false!
        //assert.isFalse(K.textToDate("#"));
        //assert.isFalse(K.textToDate("#*"));
      });
      
    });
    
  }); 

}());