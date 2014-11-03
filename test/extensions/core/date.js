/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true,
  describe:true, before:true, enyo:true, it:true, beforeEach:true */

(function () {
  "use strict";

  var zombieAuth = require("../../lib/zombie_auth"),
    assert = require("chai").assert;

  describe('Date Widget', function () {
    this.timeout(45 * 1000);
    var K, newDate;

    before(function (done) {
      // setup for the date widget
      var initializeDate = function () {
        K = enyo.kind({kind: XV.DateWidget});
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
        assert.isFalse(K.textToDate("///"));
        assert.isFalse(K.textToDate("1234*"));
      });

      // Test known good dates
      it('Test good dates', function () {
        assert.ok(K.textToDate("2/2/2004"));
        assert.ok(K.textToDate("2-10-10"));
        assert.ok(K.textToDate("2000-08-08"));
        // test the Date ISO string
        assert.ok(K.textToDate(newDate.toISOString()));
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
        assert.equal(K.textToDate("#" + days).toDateString(), daysFromStart(days).toDateString());
        days = 65;
        assert.equal(K.textToDate("#" + days).toDateString(), daysFromStart(days).toDateString());

        // really, really big one!
        days = 66666666666666765;
        assert.isFalse(K.textToDate("#" + days));
        // more managable number
        days = 9999999;
        assert.equal(K.textToDate("#" + days).toDateString(), daysFromStart(days).toDateString());

        assert.isFalse(K.textToDate("#tt"));
        assert.isFalse(K.textToDate("#"));
        assert.isFalse(K.textToDate("#*"));
      });

      // Testing entering "+" and a number to mean days from now
      it('Test adding days using +', function () {
        var daysOffset, millisecondOffset = function (offset) {
          var milliOffset = offset * 24 * 60 * 60 * 1000;
          newDate = new Date(newDate.getTime() + milliOffset);
          newDate = K.applyTimezoneOffset(newDate);
          return newDate;
        };

        daysOffset = 20;
        assert.equal(K.textToDate("+" + daysOffset).toDateString(),  millisecondOffset(daysOffset).toDateString());

        assert.isFalse(K.textToDate("+tt"));
        assert.isFalse(K.textToDate("+"));
        assert.isFalse(K.textToDate("+*"));
        assert.isFalse(K.textToDate("+99999999999999"));
      });

      // Testing entering "-" and a number to mean days before now
      it('Test subtracting days using -', function () {
        var daysOffset, millisecondOffset = function (offset) {
          var milliOffset = offset * 24 * 60 * 60 * 1000;
          newDate = new Date(newDate.getTime() - milliOffset);
          newDate = K.applyTimezoneOffset(newDate);
          return newDate;
        };

        daysOffset = 20;
        assert.equal(K.textToDate("-" + daysOffset).toDateString(),  millisecondOffset(daysOffset).toDateString());

        assert.isFalse(K.textToDate("-tt"));
        assert.isFalse(K.textToDate("-"));
        assert.isFalse(K.textToDate("-*"));
        assert.isFalse(K.textToDate("-99999999999999"));
      });

      // Test entering "0" as today's date
      it('Test that 0 is today', function () {
        newDate = K.applyTimezoneOffset(newDate);
        assert.equal(K.textToDate("0").toDateString(), newDate.toDateString());
      });

      it('Test that a number alone is a day of the month', function () {
        var day, setDay = function (day) {
          newDate = new Date();
          newDate.setDate(day);
          return K.applyTimezoneOffset(newDate);
        };
        day = "6";
        assert.equal(K.textToDate(day).toDateString(), setDay(day).toDateString());
        day = "20";
        assert.equal(K.textToDate(day).toDateString(), setDay(day).toDateString());
      });
    });
  });

}());
