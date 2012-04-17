
var _path       = require('path');
var _fs         = require('fs');

/**
*/
function Package(options) {
  var key;
  this.options = {
    'root': null,
    'path': null,
    'relativePath': null,
    'rawContent': null,
    'type': null,
    'parent': null,
    'filename': null,
    'dependencies': null,
    'dependents': null,
    'isPackage': true
  };
  for (key in options) {
    this.options[key] = options[key];
  }

  this.isBuilderObject = true;
}

var exports = module.exports = Package;

var Logger      = require('./logger');
var info        = Logger.info;
var log         = Logger.log;
var warn        = Logger.warn;
var error       = Logger.error;

Package.prototype.set = function(key, value) {
  var options = this.options;
  options[key] = value;
  return this;
}

Package.prototype.get = function(key) {
  var options = this.options;
  var value = options[key];
  return value ? value : undefined;
}

Package.prototype.__defineGetter__('content', function() {

});

