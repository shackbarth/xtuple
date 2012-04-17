
var _path       = require('path');
var _fs         = require('fs');
var _util       = require('util');

var _colors     = require('colors');

/**
*/

var exports = module.exports = A;

/**
  Passed an arguments object form a method and returns
  an array for that object.

  @param 
  @returns
*/
function A(args) {
  return Array.prototype.slice.call(args);
}
