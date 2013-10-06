/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, _:true, console:true */

(function () {
  "use strict";

  /**
    An object for performing operations on dates.
  */
  XT.date = {

    /**

    @param {Date} date
    @param {Boolean} isForward
    returns {Date} The new date
    */
    applyTimezoneOffset: function (date, isForward) {
      var direction = isForward ? 1 : -1;

      return new Date(date.valueOf() + direction * 60000 * date.getTimezoneOffset());
    },

    /**
      Converts the date in d to a date-object. The input can be:
        a date object: returned without modification
        an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        a number      : Interpreted as number of milliseconds
                       since 1 Jan 1970 (a timestamp)
        a string      : Any format supported by the javascript engine, like
                      "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
       an object     : Interpreted as an object with year, month and date
                      attributes.  **NOTE** month is 0-11.

    @param {Any}
    @returns {Date}
    */
    convert: function (d) {
      return (
        d.constructor === Date ? d :
        d.constructor === Array ? new Date(d[0], d[1], d[2]) :
        d.constructor === Number ? new Date(d) :
        d.constructor === String ? new Date(d) :
        typeof d === "object" ? new Date(d.year, d.month, d.date) :
        NaN
      );
    },

    /**
      Compare two dates (could be of any type supported by the convert
      function above) and returns:
       -1 : if a < b
       0 : if a = b
       1 : if a > b
     NaN : if a or b is an illegal date
     NOTE: The code inside isFinite does an assignment (=).

     @param {Date} Date a
     @param {Date} Date b
     @returns {Number}
    */
    compare: function (a, b) {
      return (
        isFinite(a = this.convert(a).valueOf()) &&
        isFinite(b = this.convert(b).valueOf()) ?
        (a > b) - (a < b) :
        NaN
      );
    },

    /**
    Compare two dates on date part (could be of any type supported by the
    convert function above) and returns:
       -1 : if a < b
       0 : if a = b
       1 : if a > b
     NaN : if a or b is an illegal date
     NOTE: The code inside isFinite does an assignment (=).

     @param {Any} Date a
     @param {Any} Date b
     @returns {Number}
    */
    compareDate: function (a, b) {
      if (!a || !b) {
        return NaN;
      }
      var x = new Date(a.valueOf()),
        y = new Date(b.valueOf());
      x.setHours(0, 0, 0, 0);
      y.setHours(0, 0, 0, 0);
      return this.compare(x, y);
    },

    /**
      Return the difference between two dates in days.

      @param {Date} Start date
      @param {Date} End date
      @returns {Number}
    */
    daysBetween: function (start, end) {
      var day = 1000 * 60 * 60 * 24,
        delta = start.getTime() - end.getTime();
      return Math.round(delta / day);
    },

    /**
    Checks if date in d is between dates in start and end.
    Returns a boolean or NaN:
      true  : if d is between start and end (inclusive)
      false : if d is before start or after end
      NaN   : if one or more of the dates is illegal.
    NOTE: The code inside isFinite does an assignment (=).

    @param {Date} Reference
    @param {Date} Start
    @param {Date} End
    */
    inRange: function (d, start, end) {
      return (
        isFinite(d = this.convert(d).valueOf()) &&
        isFinite(start = this.convert(start).valueOf()) &&
        isFinite(end = this.convert(end).valueOf()) ?
        start <= d && d <= end :
        NaN
      );
    },

    /**
      Returns date passed at midnight.

      @params {Date} Date
      @returns {Date}
    */
    toMidnight: function (d) {
      d.setHours(0);
      d.setMinutes(0);
      d.setSeconds(0);
      d.setMilliseconds(0);
      return d;
    },

    /**
      Returns today's date at midnight.
      returns {Date}
    */
    today: function () {
      var today = new Date();
      return this.toMidnight(today);
    },

    /**
      Returns a date object with a time of 2100-01-01T00:00:00.000Z.

      @returns {Date}
    */
    endOfTime: function () {
      return new Date("2100-01-01T00:00:00.000Z");
    },

    /**
      Returns a date object with a time of 1970-01-01T00:00:00.000Z.

      @returns {Date}
    */
    startOfTime: function () {
      return new Date("1970-01-01T00:00:00.000Z");
    },

    /**
      Evaluates whether the passed date is equal to the date returned by `endOfTime`.

      @seealso endOfTime
      @param {Date}
      @returns {Boolean}
    */
    isEndOfTime: function (d) {
      return d instanceof Date ? this.compare(this.endOfTime(), d) === 0 : false;
    },

    /**
      Evaluates whether the passed date is equal to the date returned by `startOfTime`.

      @seealso startOfTime
      @param {Date}
      @returns {Boolean}
    */
    isStartOfTime: function (d) {
      return d instanceof Date ? this.compare(this.startOfTime(), d) === 0 : false;
    }

  };

}());
