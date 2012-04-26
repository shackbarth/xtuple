// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT global */

/**
  Implementation of round on number that accepts a decimal places number as a
  argument to calculate scale. Rounds to `scale` if none specified.
  
  @param {Number} decimal places
  @param {Number} precision scale
  @returns {Number}
*/
Number.prototype.round = function(decimalPlaces) {
  var scale = decimalPlaces? decimalPlaces : this.scale;
  var power = Math.pow(10, scale);
  return Math.round(this * power) / power;
}

/**
  The default scale for `round` if no scale specified.
  
  @constant
  @default 0
*/
Number.prototype.scale = 0;