
var _path       = require('path');
var _fs         = require('fs');
var _util       = require('util');
var _ugly       = require('uglify-js');

var Graph       = require('./graph');

/**
*/
function Directory(options) {
  var key;

  this.options = {
    'filename': null,
    'path': null,
    'parent': null,
    'isDirectory': true
  };

  for (key in options) {
    this.options[key] = options[key];
  }

  this.isBuilderObject = true;

  var parent = this.get('parent');
  var filename = this.get('filename');

  // create reference to this directory on the
  // parent under the current filename
  parent.set(filename, this);
  
  this.dive();
}

var exports = module.exports = Directory;

var Logger      = require('./logger');
var Helpers     = require('./helpers');

var info        = Logger.info;
var log         = Logger.log;
var warn        = Logger.warn;
var error       = Logger.error;

var divePath    = Helpers.divePath;
var A           = Helpers.A;
var isPackage   = Helpers.isPackage;

Directory.prototype.set = function(key, value) {
  var options = this.options;
  options[key] = value;
  return this;
}

Directory.prototype.get = function(key) {
  var options = this.options;
  var value = options[key];
  return value ? value : undefined;
}

Directory.prototype.find = function(nodeName) {
  var directories = Helpers.directories(this);
  var key;
  var directory;
  for (key in directories) {
    directory = directories[key];
    if (directory.get('filename') === nodeName) {
      return directory;
    }
  }
  return undefined;
}

Directory.prototype.__defineGetter__('orderedFiles', function() {
  var collectedFiles = Helpers.files(this);
  var graph = new Graph;
  var map = {};
  var relativePath;
  var dependencies;
  var dependency;
  var sorted;
  var sortedFiles = [];
  var files = [];
  var file;

  for (var fileName in collectedFiles) {
    file = collectedFiles[fileName];
    files.push(file);
  }

  files.forEach(function(file) {
    relativePath = file.relativePath;

    info(relativePath);

    dependencies = file.dependencies;

    info(dependencies);

    map[relativePath] = file;
    graph.addVertex(relativePath);
    dependencies.forEach(function(dependency) {
      graph.addEdge(dependency, relativePath);
    });
    graph.addEdge('core.js', relativePath);
  });
  sorted = graph.topologicalSort();
  sorted.forEach(function(vertex) {
    dependency = map[vertex];
    if (dependency) sortedFiles.push(dependency);
  });
  return sortedFiles;
});

Directory.prototype.dive = function() {
  var root = this.get('path');
  var options = {
    'excludeDirectories': [
      'node_modules',
      'node',
      '.git'
    ],
    'fileTypes': ['js']
  };
  divePath(root, this, options);
}
