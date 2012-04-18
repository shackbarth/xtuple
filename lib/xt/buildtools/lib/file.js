
var _path       = require('path');
var _fs         = require('fs');
var _ugly       = require('uglify-js');

/**
*/
function File(options) {
  var key;

  this.options = {
    'filename': null,
    'path': null,
    'parent': null,
    'rawContent': null,
    'isFile': true
  };

  for (key in options) {
    this.options[key] = options[key];
  }

  this.isBuilderObject = true;

  var parent = this.get('parent');
  var filename = this.get('filename');

  // create reference to this file on the
  // parent under the current filename
  parent.set(filename, this);

  this.read();
}

var exports = module.exports = File;

var Logger      = require('./logger');
var info        = Logger.info;
var log         = Logger.log;
var warn        = Logger.warn;
var error       = Logger.error;

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
  var path = this.get('path');
  var rawContent;

  try {
    rawContent = _fs.readFileSync(path, 'utf8');
    this.set('rawContent', rawContent); 
  } catch(err) {
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
  var dependencies = [];
  var raw = this.get('rawContent');
  var regex = new RegExp("sc_require\\((['\"])(.*)\\1\\)");
  var lines = raw.split('\n'); 
  var statements;
  var result;
  lines.forEach(function(line) {
    statements = line.split(';');
    statements.forEach(function(statement) {
      result = regex.exec(statement); 
      if (result) dependencies.push(result[2]);
    });
  });
  return dependencies;
});

File.prototype.__defineGetter__('type', function() {
  var filename = this.get('filename');
  return _path.extname(filename).slice(1);
});

File.prototype.__defineGetter__('relativePath', function() {
  var path = this.get('path');
  var tree = this.get('tree');
  var root = tree.get('root');
  return path.slice(root.length+1);
});
