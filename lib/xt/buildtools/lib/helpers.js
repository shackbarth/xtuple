
var _path       = require('path');
var _fs         = require('fs');
var _util       = require('util');

var _colors     = require('colors');

/**
*/

var exports = module.exports;

exports.A           = A;
exports.divePath    = divePath;
exports.filterFiles = filterFiles;
exports.isPackage   = isPackage;
exports.builders    = builders;
exports.packages    = packages;
exports.mixin       = mixin;
exports.files       = files;
exports.directories = directories;

var Logger      = require('./logger');
var Directory   = require('./directory');
var File        = require('./file');
var Package     = require('./package');

var info        = Logger.info;
var log         = Logger.log;
var warn        = Logger.warn;
var error       = Logger.error;

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
function filterFiles(files, options) {
  var keep = [];
  var path;
  var stat;
  var file;
  var ext;

  if (!options) options = {};

  var rootPath = options.rootPath;
  var keepDirectories = options.keepDirectories;
  var keepFiles = options.keepFiles;
  var fileTypes = options.fileTypes || ['*'];
  var excludeDirectories = options.excludeDirectories || [];
  var excludeFiles = options.excludeFiles || [];

  if (keepDirectories === undefined) keepDirectories = true;
  if (keepFiles === undefined) keepFiles = true;

  var idx = 0;
  var len = files.length;

  for (; idx < len; ++idx) {
    file = files[idx];
    path = _path.join(rootPath, file);

    try {
      stat = _fs.statSync(path);
      if (stat.isFile()) {
        if (keepFiles) {
          ext = _path.extname(file).slice(1);
          if (fileTypes[0] === '*') {
            if (!~excludeFiles.indexOf(file)) {
              keep.push({
                'filename': file,
                'path': path,
                'type': 'file'
              });
            }
          } else if (!!~fileTypes.indexOf(ext)) {
            if (!~excludeFiles.indexOf(file)) {
              keep.push({
                'filename': file,
                'path': path,
                'type': 'file'
              });
            }
          }
        }
      } else if (stat.isDirectory()) {
        if (keepDirectories) {
          if (!~excludeDirectories.indexOf(file)) {
            if (isPackage(path)) {
              keep.push({
                'filename': file,
                'path': path,
                'type': 'package'
              });
            } else {
              keep.push({
                'filename': file,
                'path': path,
                'type': 'directory'
              });
            }
          }
        }
      }
    } catch(err) {
      error(err);
      process.exit(-1);
    }
  }
  return keep;
}

/**
*/
function divePath(rootPath, node, options) {
  var stat;
  var files;
  var path;
  var next;
  var type;
  var filename;
  var tree;
  var defaults = {
    'keepDirectories': true,
    'keepFiles': true,
    'fileTypes': ['*'],
    'excludeDirectories': [],
    'excludeFiles': [],
    'rootPath': rootPath
  };

  if (!options) options = {};

  for (var opt in options) {
    defaults[opt] = options[opt];
  }

  if (node.get('isTree')) {
    tree = node;
  } else { tree = node.get('tree'); }

  try {

    // find all of the files in the current directory
    // regardless of type or any other features
    files = _fs.readdirSync(rootPath);
    // wittle them down by the options selected
    files = exports.filterFiles(files, defaults);
    // iterate over the files that we can use now
    // and store them on the proper node
    files.forEach(function(file) {
      type = file.type;
      filename = file.filename;
      path = file.path;
      
      if (type === 'file') {
        new File({
          'filename': filename,
          'path': path,
          'parent': node,
          'tree': tree
        });
      } else if (type === 'directory') {
        new Directory({
          'filename': filename,
          'path': path,
          'parent': node,
          'tree': tree
        });
      } else if (type === 'package') {
        new Package({
          'filename': filename,
          'path': path,
          'parent': node,
          'tree': tree
        });
      }
    });
  } catch (err) {
    error(err);
    process.exit(-1);
  }
}

function isPackage(directory) {
  var path = _path.join(directory, 'node', 'package.json');
  var stat;
  try {
    stat = _fs.statSync(path);
    return stat.isFile();
  } catch (err) {
    return false;
  }
}

function builders(node) {
  if (!node.isBuilderObject) return {};
  var objects = {};
  var key;
  var options = node.options;
  var childNode;
  for (key in options) {
    childNode = options[key];
    if (!childNode.isBuilderObject) continue;
    objects[key] = childNode;
  }
  return objects;
}

function packages(node) {
  var collected = {};
  var childNodes = builders(node);
  var key;
  var childNode;
  for (key in childNodes) {
    childNode = childNodes[key];
    if (childNode === node.get('parent')) continue;
    if (childNode.get('isPackage')) {
      collected[childNode.packageName] = childNode;
    } else if (childNode.get('isDirectory')) {
      collected = mixin(collected, packages(childNode));
    }
  }
  return collected;
}

function files(node) {
  var collected = {};
  var childNodes = builders(node);
  var key;
  var childNode;
  for (key in childNodes) {
    childNode = childNodes[key];
    if (childNode === node.get('parent')) continue;
    if (childNode.get('isFile')) {
      collected[childNode.get('filename')] = childNode;
    } else if (childNode.get('isDirectory')) {
      collected = mixin(collected, files(childNode));
    }
  }
  return collected;
}

function directories(node) {
  var collected = {};
  var childNodes = builders(node);
  var key;
  var childNode;
  for (key in childNodes) {
    childNode = childNodes[key];
    if (childNode === node.get('parent')) continue;
    if (childNode.get('isDirectory')) {
      collected[childNode.get('path')] = childNode;
      collected = mixin(collected, directories(childNode));
    }
  }
  return collected;
}

function mixin(base, extension) {
  var key;
  for (key in extension) {
    if (!extension.hasOwnProperty(key)) continue;
    base[key] = extension[key];
  }
  return base;
}
