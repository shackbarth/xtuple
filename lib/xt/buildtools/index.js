
var _path       = require('path');
var _fs         = require('fs');
var _util       = require('util');
var _crypto     = require('crypto');

/**
  Blossom supplies its own build tools that serve a specific purpose
  for hosting SproutCore/Blossom applications. The xTuple Postbooks
  application requires some specific needs that are simpler in some cases
  and more proprietary than can be provided by a generic framework system
  out of the box. Thus the evolution of the xTuple buildtools.
  
  @author W. Cole Davis
*/

var exports = module.exports;

var helpers     = require('./lib/helpers');

// The buildtools methods are exported as a convenience.
// First are the additions of helper methods that aid all
// of the builttool components. 
exports.directories = helpers.directories;
exports.files       = helpers.files;
exports.A           = helpers.A;
exports.log         = helpers.log;
exports.error       = helpers.error;
exports.warn        = helpers.warn;
exports.info        = helpers.info;
// Next are the real substance of the builtools including the
// container objects and builder.
exports.file    = require('./lib/file');
exports.package = require('./lib/package');
exports.builder = require('./lib/builder');
