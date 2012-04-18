
var _path       = require('path');
var _fs         = require('fs');
var _ugly       = require('uglify-js');

/**
*/
function Tree(options) {
  var key;

  this.options = {
    'root': null,
    'filename': null,
    'isTree': true
  };

  for (key in options) {
    this.options[key] = options[key];
  }

  if (!this.get('filename')) {
    this.set('filename', _path.basename(this.get('root')));
  }

  this.isBuilderObject = true;

  this.dive();
}

var exports = module.exports = Tree;

var Helpers     = require('./helpers');
var Logger      = require('./logger');

var info        = Logger.info;
var log         = Logger.log;
var warn        = Logger.warn;
var error       = Logger.error;

var divePath    = Helpers.divePath;
var A           = Helpers.A;
var builders    = Helpers.builders;
var packages    = Helpers.packages;

Tree.prototype.set = function(key, value) {
  var options = this.options;
  options[key] = value;
  return this;
}

Tree.prototype.get = function(key) {
  var options = this.options;
  var value = options[key];
  return value ? value : undefined;
}

Tree.prototype.dive = function() {
  var root = this.get('root');
  var options = {
    'excludeDirectories': [
      'node',
      '.git',
      'tests'
    ],
    'keepFiles': false
  };
  divePath(root, this, options);
}

Tree.prototype.__defineGetter__('packages', function() {
  return packages(this);
});
