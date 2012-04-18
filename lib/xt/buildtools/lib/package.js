
var _path       = require('path');
var _fs         = require('fs');

/**
*/
function Package(options) {
  var key;

  this.options = {
    'filename': null,
    'path': null,
    'parent': null,
    'type': null,
    'dependencies': null,
    'dependents': null,
    'isPackage': true
  };

  for (key in options) {
    this.options[key] = options[key];
  }

  this.isBuilderObject = true;

  var parent = this.get('parent');
  var filename = this.get('filename');

  // create reference to this package on the
  // parent under the current filename
  parent.set(filename, this);

  this.dive();
  this.findOrigin();
}

var exports = module.exports = Package;

var Logger      = require('./logger');
var Helpers     = require('./helpers');

var info        = Logger.info;
var log         = Logger.log;
var warn        = Logger.warn;
var error       = Logger.error;

var divePath    = Helpers.divePath;
var A           = Helpers.A;

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

Package.prototype.dive = function() {
  var root = this.get('path');
  var options = {
    'fileTypes': ['js', 'json']
  };
  divePath(root, this, options);
}

Package.prototype.findOrigin = function() {
  var path = this.get('path');
  var parts = path.split('/');
  var idx = parts.indexOf('packages');
  this.set('origin', parts[idx-1]);
}

Package.prototype.__defineGetter__('packageName', function() {
  return this.get('origin') + '/' + this.get('filename');
});
