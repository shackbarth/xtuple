
var _path       = require('path');
var _fs         = require('fs');

var _dive       = require('diveSync');

/**
*/
function Builder() {
  this.options = {};
}

var exports = module.exports = new Builder;

var helpers     = require('./helpers');
var info        = helpers.info;
var log         = helpers.log;
var warn        = helpers.warn;
var error       = helpers.error;
var directories = helpers.directories;
var files       = helpers.files;

Builder.prototype.set = function(key, value) {
  var options = this.options;
  options[key] = value;
  return this;
}

Builder.prototype.get = function(key) {
  var options = this.options;
  var value = options[key];
  return value ? value : undefined;
}

Builder.prototype.build = function() {
  this.dive();
}

Builder.prototype.dive = function() {
  var root = this.get('root');
  var app = this.get('app');
  var stat;
  try {
    stat = _fs.statSync(root);
    if (stat.isDirectory()) {
      _dive(root, { filter: diveFilter }, function(err, filename) {
        info(filename);
      });
    } else {
      throw new Error("Cannot create builder from the " +
        "requested root directory tree");
    }
  } catch (err) {
    error(err);
    process.exit(-1);
  }
}

function diveFilter(filename, isDir) {
  if (isDir) return true;
  if (_path.extname(filename) === '.js') return true;
}
