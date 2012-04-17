
var _path       = require('path');
var _fs         = require('fs');
var _ugly       = require('uglify-js');

/**
*/
function File(options) {
  var key;

  this.options = {
    'path': null,
    'relativePath': null,
    'rawContent': null,
    'parent': null,
    'filename': null
  };

  for (key in options) {
    this.options[key] = options[key];
  }

  // this.read();
}

var exports = module.exports = File;

var helpers     = require('./helpers');
var info        = helpers.info;
var log         = helpers.log;
var warn        = helpers.warn;
var error       = helpers.error;
var directories = helpers.directories;
var files       = helpers.files;

File.prototype.set = function(key, value) {
  var options = this.options;
  options[key] = value;
  return this;
}

File.prototype.get = function(key) {
  var options = this.options;
  var value = options[key];
  return value ? value : undefined;
}

File.prototype.read = function() {
  var options = this.options;
  var path = options.path;
  var rawContent;

  if (!path) path = _path.resolve(__dirname, options.relativePath);

  try {
    rawContent = _fs.readFileSync(path);
    this.set('rawContent', rawContent); 
  } catch(err) {
    warn("unable to read file contents for file " + this.get('name'));
    error(err);
    process.exit(-1);
  }
}

File.prototype.__defineGetter__('content', function() {
  var rawContent = this.get('rawContent');
  var jsp = _ugly.parser;
  var pro = _ugly.uglify;
  var ast;
  var content;
  var regex = new RegExp('sc_require\(.*\);');
  rawContent = rawContent.replace(regex, '');
  ast = jsp.parse(rawContent);
  ast = pro.ast_mangle(ast);
  ast = pro.ast_squeeze(ast);
  content = pro.gen_code(ast);
  return content;
});

File.prototype.__defineGetter__('dependencies', function() {

});

File.prototype.__defineGetter__('type', function() {
  var filename = this.get('filename');
  return _path.extname(filename).slice(1);
});
