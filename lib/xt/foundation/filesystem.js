
var _fs      = require('fs');
var _path    = require('path');

XT.mixin(XT,
  /** @lends XT */ {
    
  /**
    The base path for the executing process.
  */
  basePath: process.cwd(),

  /**
    Find and return paths to all files in a specified directory.
    Optionally an extension can be specified as the third paramater.
    The second parameter is the callback on completion. This method is
    asynchronous.
  
    @param {String} path The path to the directory.
    @param {Function} callback The callback expects a single (array) parameters of the results.
    @param {String} [extension] The file extension to look for (otherwise all file types).
  */
  directoryFiles: function(path, callback, extension) {
    var files;
    path = _path.normalize(path);
    try {
      if (XT.typeOf(callback) !== XT.T_FUNCTION) {
        extension = callback;
        files = _fs.readdirSync(path);
        return XT.typeOf(extension) === XT.T_STRING ? XT.reduce(files, extension) : files;
      } else {
        _fs.readdir(path, function(err, files) {
          callback(XT.typeOf(extension) === XT.T_STRING ? XT.reduce(files, extension) : files);
        });
      }
    } catch(err) { 
      XT.warn(err); 
      if (XT.typeOf(callback) === XT.T_FUNCTION) {
        callback([]); 
      } else { return []; }
    }
  }, 

  /**
    Takes what might be a very long file path and shortens it to
    a (default 3) maximum number of slashes counting from the end
    and prepends an elipses. This is strictly for aesthetic/human-
    readability purposes.

    @param {String} path The file path needing to be shortended.
    @param {Number} [max] The maximum number of slashes to include.
    @returns {String} The normalized/shortened file path.
  */
  shorten: function(path, max) {
    if(XT.none(max)) max = 3;
    if(XT.none(path) || XT.typeOf(path) !== XT.T_STRING) return path;

    var count = path.match(/\//g).length;

    if(!count || count <= max) return path;
    
    var found = 0;
    var total = count - max;
    var idx = 0;
    var copy = path;

    while(found < total && !!~idx) {
      idx = copy.indexOf('/');
      copy = copy.slice(idx == 0 ? 1 : idx);
      if(idx != 0) found += 1;
    }

    return '...%@'.f(copy);
  },
  
  /**
    Reads the contents of a given file and/or path. This assumes utf-8
    encoding and is asynchronous in execution.
    
    @param {String} path The path to the directory containing the file
      or the full path to the file.
    @param {String} filename The name of the file if only directory path is provided (will be normalized).
    @param {Function} callback The callback takes an error and filedata paramaters.
  */
  readFile: function(path, filename, callback) {
    if(XT.typeOf(filename) === XT.T_FUNCTION) {
      callback = filename;
      filename = '';
    }
    path = _path.join(path, filename);
    try {
      _fs.readFile(path, 'utf-8', callback)
    } catch(err) {
      XT.warn(err);
      callback("");
    }
  },

  /**
    Returns the `.` stripped file extension or an empty
    string if none exists for the parameter.

    @param {String} path The path to the file.
    @return {String} The file extension or an empty string if
      none exists.
    @method
  */
  ext: function(path) {
    var ext = _path.extname(path);
    return ext.length > 1 ? ext.slice(1) : ext;
  },
  
  /**
    Splits a string into individual lines. Can be used for normal strings or
    from file data. This function is synchronous and returns an array of lines.
  
    @param {String} content The string or file data to parse.
    @returns {Array} The array of lines from the string.
  */
  byLine: function(content) {
    if(!content || content.length == 0 || XT.typeOf(content) !== XT.T_STRING) return [];
    return content.split('\n') || [];
  },

  /**
    Tests for the existence of the specified path. Can be
    executed asynchronously by providing a callback else it
    will be executed synchronously.

    @param {String} path The path to test.
    @param {Function} [callback] The callback if desired execution
      is synchronous.
    @returns {Boolean} If executed synchronously will return a
      boolean true|false depending the results of the test.
  */
  exists: function(path, callback) {
    var stats;
    if(!XT.none(callback) && XT.typeOf(callback) === XT.T_FUNCTION)
      return _fs.stat(path, function(err, stats) {
        if(err) callback(false, null);
        else if(stats.isDirectory() || stats.isFile())
          callback(true, stats);
        else callback(false, stats);
      });
    try {
      stats = _fs.statSync(path);
      return stats.isDirectory() || stats.isFile() ? true : false;
    } catch(err) {
      issue(XT.warning(err));
      return false;
    }
  },

  /**
  */
  createDir: function(path, callback) {
    _fs.mkdir(path, callback);
  },

  /**
  */
  writeFile: function(path, content, callback) {
    if(XT.none(callback) || XT.typeOf(callback) !== XT.T_FUNCTION) {
      _fs.writeFileSync(path, content, 'utf8');
    }
  },
  
  /**
    Reduces an array of filenames to just files with the specified
    extension. This is a synchronous function.
    
    @param {Array} files The array of filenames.
    @param {String} extension The filetype extension to look for.
    @returns {Array} The array of files with the provided extension.
  */
  reduce: function(files, extension) {
    if (!files || files.length < 1) return files || [];
    var idx = 0;
    var len = files.length;
    var ret = [];
    var chars = extension.length;
    var stripped;
    for (; idx < len; ++idx) {
      stripped = files[idx].length - chars;
      if (!!~files[idx].indexOf(extension) && files[idx][stripped] == extension[0]) {
        ret.push(files[idx]);
      }
    }
    return ret;
  }
      
}) ;
