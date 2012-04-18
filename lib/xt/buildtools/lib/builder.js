
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
var Directory   = require('./directory');
var Tree        = require('./tree');
var Logger      = require('./logger');
var Helpers     = require('./helpers');

var A           = Helpers.A;
var divePath    = Helpers.divePath;
var builders    = Helpers.builders;

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
  var app = this.get('app');
  var xt;
  var xm;
  var blossom;
  var packages;
  var foundation;
  var application;
  var datastore;

  // this builder knows what frameworks it is looking
  // for...
  app = this.find(app, 'apps');
  xt = this.find('xt', 'frameworks');
  xm = this.find('xm', 'frameworks'); 
  blossom = this.find('blossom', 'node_modules');
  packages = this.packages;

  foundation = blossom.find('foundation');
  application = blossom.find('application');
  datastore = blossom.find('datastore'); 

  var ordered = foundation.orderedFiles;
  ordered.forEach(function(file) {
    console.log(file.get('path'));
  });
  // console.log(application);
  // console.log(datastore);

}

Builder.prototype.dive = function() {
  var root = this.get('root');
  this.options.tree = new Tree({
    'root': root
  });
}

Builder.prototype.find = function(nodeName, type) {
  var tree = this.get('tree');
  var target = tree.get(type);
  var node = target.get(nodeName);
  if (!node) warn("Unable to find requested " + type + ": " + nodeName);
  return node;
}

Builder.prototype.__defineGetter__('packages', function() {
  return this.get('tree').packages;
});
