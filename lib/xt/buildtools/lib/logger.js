
var _util       = require('util');
var _colors     = require('colors');

/**
*/

var exports = module.exports;

var Helpers     = require('./helpers');
var A           = Helpers.A;

exports.log     = log;
exports.error   = error;
exports.warn    = warn;
exports.info    = info;

// for the pure joy of it
_colors.setTheme({
  error: 'red',
  warn: 'rainbow',
  info: 'green'
});

/**
  Logs any number of elements.

  @param
  @returns
*/
function log() {
  var args = A(arguments);
  var idx = 0;
  var msg;
  for (; idx < args.length; ++idx) {
    msg = args[idx];
    if (typeof msg === 'string') {
      console.log(msg);
    } else {
      console.log(_util.inspect(msg));
    }
  }
}

/**

  @param
  @returns 
*/
function error(msg) {
  if (typeof msg === 'string') {
    log(msg.error);
  } else {
    var message = msg.message;
    var stack = msg.stack;
    message = "<<BUILD ERROR>> " + message;
    log(message.error, "", stack.error);
  }
}

/**
  
  @param
  @returns
*/
function warn(msg) {
  if (typeof msg === 'string') {
    log(msg.warn);
  } else {
    log(_util.inspect(msg).warn);
  }
}

/**
  
  @param
  @returns
*/
function info() {
  var args = A(arguments);
  var idx = 0;
  var msg;
  for (; idx < args.length; ++idx) {
    msg = args[idx];
    if (typeof msg === 'string') {
      args[idx] = msg.info;
    } else {
      args[idx] = _util.inspect(msg).info;
    }
  }
  log.apply(null, args);
}
