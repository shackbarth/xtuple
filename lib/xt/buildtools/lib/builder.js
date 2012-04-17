
var _path       = require('path');
var _fs         = require('fs');
var _util       = require('util');

/**
*/
function Builder() {
  this.options = {};
}

var exports = module.exports = new Builder;

var File        = require('./file');
var Package     = require('./package');
var Logger      = require('./logger');
var info        = Logger.info;
var log         = Logger.log;
var warn        = Logger.warn;
var error       = Logger.error;

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
  var tree = this.options.tree = new File({
    'isTree': true,
    'isDirectory': true,
    'filename': _path.basename(root),
    'path': root
  });

  diveFrom(root, tree);

  // console.log(_util.inspect(tree, true, 10));
}

Builder.prototype.__defineGetter__('packages', function() {
  var tree = this.get('tree');
  var packages = findPackagesFrom(tree);
  console.log(packages);
});

//..............................................
// HELPER FUNCTIONS
//
function diveFrom(rootPath, node) {
  var stat;
  var files;
  var path;
  var parentFilename;

  try {
    files = _fs.readdirSync(rootPath);
    files.forEach(function(file) {

      if (file[0] === '.') return;

      path = _path.join(rootPath, file);
      stat = _fs.statSync(path);

      if (stat.isFile()) {
        if (!~file.indexOf('.js')) return;
      } else if (stat.isDirectory()) {
        if (file === 'node_modules') return;
        if (file === 'node') return;
      }

      // every node is a file of sorts
      // but may have additional properties
      node[file] = new File({
        'path': path,
        'parent': node,
        'filename': file
      });

      // if it is a directory it gets the directory
      // flag plus a few additional inspections
      if (stat.isDirectory()) {
        node[file].set('isDirectory', true);
    
        parentFilename = node.get('parent').get('filename'); 

        if (parentFilename === 'frameworks') {
          node[file].set('isFramework', true);
        } else if (parentFilename === 'apps') {
          node[file].set('isApp', true);
        } else if (file === 'packages') {

          // special handler for packages
          return divePackages(path, node[file]);
        }

        // now go look for more stuff
        diveFrom(path, node[file]);
      }
    });
  } catch (err) {
    error(err);
    process.exit(-1);
  }
}

function divePackages(rootPath, node) {

  console.log("DIVE PACKAGES");

  var stat;
  var files;
  var path;
  try {
    files = _fs.readdirSync(rootPath);
    files.forEach(function(file) {
      path = _path.join(rootPath, file);
      stat = _fs.statSync(path);
      if (!stat.isDirectory()) return;
      if (isPackageDirectory(path)) {

        console.log("FOUND A PACKAGE DIRECTORY!");

        node[file] = new Package({
          'path': path,
          'parent': node,
          'filename': file,
          'isDirectory': true
        });
        diveFrom(path, node[file]);
      } else {

        console.log("FOUND A NESTED DIRECTORY BENEATH PACKAGES");

        node[file] = new File({
          'path': path,
          'parent': node,
          'filename': file,
          'isDirectory': true
        });
        divePackages(path, node[file]);
      }
    });
  } catch (err) {
    error(err);
    process.exit(-1);
  }
}

function isPackageDirectory(rootPath) {
  var path = _path.join(rootPath, 'node', 'package.json');
  var stat;
  try {
    stat = _fs.statSync(path);
    return stat.isFile();
  } catch (err) {
    return false;
  }
}

function findPackagesFrom(node) {

  console.log("findPackagesFrom " + node.get('filename'));

  var nodeName;
  var childNode;
  var packages = [];
  for (nodeName in node) {
    childNode = node[nodeName];
    if (!childNode.isBuilderObject) continue;
    if (childNode.get('isPackage')) {
      packages.push(childNode);
    } else if (childNode.get('isDirectory')) {
      packages = packages.concat(findPackagesFrom(childNode));
    }
  }
  return packages;
}
