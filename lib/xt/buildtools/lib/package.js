
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
    'name': null,
    'dependencies': null,
    'dependents': null
  };
  for (key in options) {
    this.options[key] = options[key];
  }
}

var exports = module.exports = Package;

var helpers     = require('./helpers');
var info        = helpers.info;
var log         = helpers.log;
var warn        = helpers.warn;
var error       = helpers.error;
var directories = helpers.directories;
var files       = helpers.files;

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

