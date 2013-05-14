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
    var K, newDate = new Date();
    
    before(function (done) {
      // setup for the date widget
      var initializeDate = function () {
        K = enyo.kind({kind: XV.Date});
        K = new K();
        done();
      };
      
      zombieAuth.loadApp(initializeDate);
    });
    
    // reset the date before each test
    beforeEach(function () {
      newDate = new Date();
    });
    
    describe('Test Text to Date', function () {
      // Test known bad dates
      it('Test just plain bad date', function () {
        assert.isFalse(K.textToDate("********"));
        assert.isFalse(K.textToDate("BEWARE. I AM BAD."));
        assert.isFalse(K.textToDate("%"));
        assert.isFalse(K.textToDate("%123"));
        assert.isFalse(K.textToDate("/////"));
      });
      
      // Test known good dates
      it('Test good dates', function (){
        assert.ok(K.textToDate("2/2/2004"));
      });
      
      // Test entering "#" and a number to get x days in the year
      it('Test day of the year using #', function () {
        var days, daysFromStart = function (days) {
          newDate = new Date();
          newDate = new Date(newDate.getFullYear(), 0, days, 0, 0, 0, 0);
          newDate = K.applyTimezoneOffset(newDate);
          return newDate;
        };
        
        days = 20;
        assert.equal(K.textToDate("#" + days), daysFromStart(days));
        days = 65;
        assert.equal(K.textToDate("#" + days), daysFromStart(days));
        
        // really, really big one!
        days = 66666666666666765;
        assert.isFalse(K.textToDate("#" + days));
        // more managable number
        days = 9999999;
        assert.equal(K.textToDate("#" + days), daysFromStart(days));
        
        // and it works backward!
        days = -67;
        assert.equal(K.textToDate("#" + days), daysFromStart(days));
        
        assert.isFalse(K.textToDate("#tt"));
        assert.isFalse(K.textToDate("#"));
        assert.isFalse(K.textToDate("#*"));
      });
      
      // Testing entering "+" and a number to mean days from now
      it('Test adding days using +', function () {
        var daysOffset, millisecondOffset = function (offset) {
          return offset * 24 * 60 * 60 * 1000;
        };
        
        daysOffset = 20;
        newDate.setTime(newDate.getTime() + millisecondOffset(daysOffset));
        assert.equal(K.textToDate("+" + daysOffset), newDate);
        
        daysOffset = 40;
        newDate.setTime(newDate.getTime() + millisecondOffset(daysOffset));
        assert.equal(K.textToDate("+" + daysOffset), newDate);
        
        // zomg so far into the future
        daysOffset = 999999999993453;
        newDate.setTime(newDate.getTime() + millisecondOffset(daysOffset));
        //assert.equal(K.textToDate("+" + daysOffset), newDate);
        
        assert.isFalse(K.textToDate("+tt"));
        assert.isFalse(K.textToDate("+"));
        assert.isFalse(K.textToDate("+*"));
      });
      
      // Testing entering "-" and a number to mean days before now
      it('Test subtracting days using -', function () {
        var daysOffset, millisecondOffset = function (offset) {
          return offset * 24 * 60 * 60 * 1000;
        };
        
        daysOffset = 20;
        newDate.setTime(newDate.getTime() - millisecondOffset(daysOffset));
        assert.notStrictEqual(K.textToDate("-" + daysOffset), newDate);
        
        daysOffset = 40;
        newDate.setTime(newDate.getTime() - millisecondOffset(daysOffset));
        assert.equal(K.textToDate("-" + daysOffset), newDate);
        
        // zomg so far into the past
        daysOffset = 999999999993453;
        newDate.setTime(newDate.getTime() - millisecondOffset(daysOffset));
        //assert.equal(K.textToDate("-" + daysOffset), newDate);
        
        assert.isFalse(K.textToDate("-tt"));
        assert.isFalse(K.textToDate("-"));
        assert.isFalse(K.textToDate("-*"));
      });
      
      // Test entering "0" as today's date
      it('Test that 0 is today', function () {
        newDate = K.applyTimezoneOffset(newDate);
        assert.equal(K.textToDate("0"), newDate);
      });
      
      it('Test that a number alone is a day of the month', function () {
        var day = "6";
        assert.equal(K.textToDate(day), newDate.setDate(day));
        day = "20";
        assert.equal(K.textToDate(day), newDate.setDate(day));
      });
      
      it('Test that a number alone will not exceed the last day of the month', function () {
        var day = "1000";
        assert.equal(K.textToDate(day).getMonth(), newDate.getMonth());
        newDate.setMonth(newDate.getMonth() + 1);
        newDate.setDate(0);
        assert.equal(K.textToDate(day), newDate);
      });
    });
  });

}());