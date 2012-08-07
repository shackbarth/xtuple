/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true, 
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, _:true, console:true */

(function () {
  "use strict";

  /**
    An object for performing operations that take Javascript's floating point
    limitations into account.
  */
  XT.math = {

    /**
      @param {Number} Value 1
      @param {Number} Value 2
      @param {Number} Scale
    */
    add: function (value1, value2, scale) {
      scale =  scale || 0;
      var power = Math.pow(10, scale);
      return Math.round(value1 * power + value2 * power) / power;
    },

    /**
      Rounds a number to a given scale.
    
      @param {Number} Value to round
      @param {NumberScale} Scale
      @returns {Number}
    */
    round: function (value, scale) {
      scale =  scale || 0;
      var power = Math.pow(10, scale);
      return Math.round(value * power) / power;
    },

    /**
      @param {Number} Value 1
      @param {Number} Value 2
      @param {Number} Scale
    */
    subtract: function (value1, value2, scale) {
      scale =  scale || 0;
      var power = Math.pow(10, scale);
      return Math.round(value1 * power - value2 * power) / power;
    }

  };

}());
