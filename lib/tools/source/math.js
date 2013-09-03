/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, 
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true */
/*global XT:true, _:true */

(function () {
  "use strict";

  /**
    An object for performing operations that take Javascript's floating point
    limitations into account.
  */
  XT.math = {

    /**
      Add two numbers to a give scale, or an array of numbers to a given scale.
      If no scale is provided, scale will default to zero.
      
      @param {Number | Object} Value 1 or Array
      @param {Number} Value 2 or Scale if first parameter is array
      @param {Number} Scale
    */
    add: function (value1, value2, scale) {
      var x = 0.0,
        power;
      // Handle array case
      if (typeof value1 === "object") {
        scale =  value2 || 0;
        power = Math.pow(10, scale);
        _.each(value1, function (val) {
          x += val * power;
        });
      } else {
        scale =  scale || 0;
        power = Math.pow(10, scale);
        x = value1 * power + value2 * power;
      }

      return x !== 0 ? Math.round(x) / power : x;
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
      var power = Math.pow(10, scale),
        res = Math.round(value1 * power - value2 * power);
      return res !== 0 ? res / power : 0;
    }

  };

}());
