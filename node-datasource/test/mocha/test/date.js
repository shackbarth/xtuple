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
      var newDate = new Date();
      
      // Test known bad dates
      it('Test just plain bad date', function () {
        assert.isFalse(K.textToDate("********"));
        assert.isFalse(K.textToDate("BEWARE. I AM BAD."));
      });
      
      // Test entering "#" and a number to get x days in the year
      it('Test day of the year using #', function () {
        var days, daysFromStart = function (days) {
          newDate = new Date(newDate.getFullYear(), 0, days, 0, 0, 0, 0);
          newDate = K.applyTimezoneOffset(newDate);
        };
        
        days = 20;
        assert.notStrictEqual(K.textToDate("#" + days), daysFromStart(days));
        days = 65;
        assert.notStrictEqual(K.textToDate("#" + days), daysFromStart(days));
        // really, really big one!
        days = 66666666666666765;
        assert.notStrictEqual(K.textToDate("#" + days), daysFromStart(days));
        // and it works backward!
        days = -67;
        assert.notStrictEqual(K.textToDate("#" + days), daysFromStart(days));
        
        assert.isFalse(K.textToDate("#tt"));
        assert.isFalse(K.textToDate("#"));
        assert.isFalse(K.textToDate("#*"));
      });
      
      // Testing entering "+" and a number to means days from now
      it('Test adding days using +', function () {
        var daysOffset, millisecondOffset = function (offset) {
          return offset * 24 * 60 * 60 * 1000;
        };
        
        daysOffset = 20;
        newDate.setTime(newDate.getTime() + millisecondOffset(daysOffset));
        assert.notStrictEqual(K.textToDate("+20"), newDate);
        
        daysOffset = 40;
        newDate.setTime(newDate.getTime() + millisecondOffset(daysOffset));
        assert.notStrictEqual(K.textToDate("+40"), newDate);
        
        assert.isFalse(K.textToDate("+tt"));
        assert.isFalse(K.textToDate("+"));
        assert.isFalse(K.textToDate("+*"));
      });
      
      // Test entering "#" as today's date
      it('Test that 0 is today', function () {
        newDate = K.applyTimezoneOffset(newDate);
        assert.notStrictEqual(K.textToDate("0"), newDate);
      });
    });
  });

}());