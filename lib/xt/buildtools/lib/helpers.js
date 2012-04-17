
var _path       = require('path');
var _fs         = require('fs');
var _util       = require('util');

var _colors     = require('colors');

/**
*/

var exports = module.exports;

var logger      = require('./logger');
var File        = require('./file');

exports.directories = directories;
exports.files       = files;
exports.A           = A;
exports.log         = logger.log;
exports.error       = logger.error;
exports.warn        = logger.warn;
exports.info        = logger.info;

/**
  Passed an arguments object form a method and returns
  an array for that object.

  @param 
  @returns
*/
function A(args) {
  return Array.prototype.slice.call(args);
}

/**
*/
function directories(root) {
  var files = [];
  var stat;
  var path;
  try {
    files = _fs.readdirSync(root);
    files = files.filter(function(file) {
      path = _path.join(root, file);
      stat = _fs.statSync(path);
      return stat.isDirectory() && file[0] !== '.';
    });
    exports.info(files);
  } catch(err) {
    exports.error(err); 
    process.exit(-1);
  }
}

/**
*/
function files(root, types) {
  var files = [];
  var returnFiles = [];
  var stat;
  var path;
  var ext;

  if (!types || !(types instanceof Array)) {
    if (typeof types !== 'string' || types.length <= 0) {
      types = '*';
    }
  }

  try {
    files = _fs.readdirSync(root);
    files = files.filter(function(file) {
      path = _path.join(root, file);
      stat = _fs.statSync(path);
      ext = _path.extname(path).slice(1);
      return stat.isFile() && (!!~types.indexOf(ext) || types === '*'); 
    });

    exports.info(files);
    
    files.forEach(function(filename) {
      returnFiles.push(new File({ 
        filename: filename,
        path: _path.join(root, filename),
        root: root
      }));
    });
    return returnFiles;
  } catch (err) {
    exports.error(err);
    process.exit(-1);
  }
}
