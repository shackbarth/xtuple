/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, issue:true */

(function () {
  "use strict";

  var _fs = X.fs, _path = X.path;

  X.mixin(/** @lends X */ {

    /**
      Base path.

      @type {String}
     */
    basePath: process.cwd(),

    /**
      Directory Files.

      @param {String} path
      @param {Object} options
      @param {Function} callback
     */
    directoryFiles: function (path, options, callback) {
      var files;
      if (options) {
        if (X.typeOf(options) === X.T_FUNCTION) {
          callback = options;
          options = {};
        }
      } else if (X.none(options)) options = {};

      path = _path.normalize(path);

      try {
        if (X.typeOf(callback) !== X.T_FUNCTION) {
          files = _fs.readdirSync(path);
          if (options.extension) {
            files = X.reduce(files, options.extension);
          }
          return options.fullPath ? files.map(function (file) {
            return _path.join(path, file);
          }) : files;
        } else {
          _fs.readdir(path, function (err, files) {
            if (options.extension) {
              files = X.reduce(files, options.extension);
            }
            callback(options.fullPath ? files.map(function (file) {
              return _path.join(path, file);
            }) : files);
          });
        }
      } catch (err) {
        X.warn(err);
        if (X.typeOf(callback) === X.T_FUNCTION) {
          callback([]);
        } else { return []; }
      }
    },

    /**
      Shortens path.

      @param {String} path
      @param {Number} max
     */
    shorten: function (path, max) {
      if (X.none(max)) max = 3;
      if (X.none(path) || X.typeOf(path) !== X.T_STRING) return path;

      var count = path.match(/\//g).length;

      if (!count || count <= max) return path;

      var found = 0;
      var total = count - max;
      var idx = 0;
      var copy = path;

      while (found < total && !!~idx) {
        idx = copy.indexOf('/');
        copy = copy.slice(idx === 0 ? 1 : idx);
        if (idx !== 0) found += 1;
      }

      return '...%@'.f(copy);
    },

    readFile: function (path, filename, callback) {
      var args = X.$A(arguments);
      if (args.length === 1)
      
        // TODO: will throw error?
        return _fs.readFileSync(path, "utf8").trim();
      
      if (X.typeOf(filename) === X.T_FUNCTION) {
        callback = filename;
        filename = '';
      }
      path = _path.join(path, filename);
      try {
        _fs.readFile(path, 'utf-8', callback);
      } catch (err) {
        X.warn(err);
        callback("");
      }
    },

    ext: function (path) {
      var ext = _path.extname(path);
      return ext.length > 1 ? ext.slice(1) : ext;
    },

    byLine: function (content) {
      if (!content || content.length === 0 || X.typeOf(content) !== X.T_STRING) return [];
      return content.split('\n') || [];
    },

    exists: function (path, callback) {
      var stats;
      if (!X.none(callback) && X.typeOf(callback) === X.T_FUNCTION) {
        return _fs.stat(path, function (err, stats) {
          if (err) callback(false, null);
          else if (stats.isDirectory() || stats.isFile())
            callback(true, stats);
          else callback(false, stats);
        });
      }
      try {
        stats = _fs.statSync(path);
        return stats.isDirectory() || stats.isFile() ? true : false;
      } catch (err) {
        //issue(X.warning(err));
        return false;
      }
    },

    createDir: function (path, callback) {
      _fs.mkdir(path, callback);
    },

    writeFile: function (path, content, callback) {
      if (X.none(callback) || X.typeOf(callback) !== X.T_FUNCTION) {
        _fs.writeFileSync(path, content, 'utf8');
      }
    },
    
    removeFile: function (path) {
      _fs.unlinkSync(path);
    },

    reduce: function (files, extension) {
      if (!files || files.length < 1) return files || [];
      var idx = 0;
      var len = files.length;
      var ret = [];
      var chars = extension.length;
      var stripped;
      for (; idx < len; ++idx) {
        stripped = files[idx].length - chars;
        if (!!~files[idx].indexOf(extension) && files[idx][stripped] === extension[0]) {
          ret.push(files[idx]);
        }
      }
      return ret;
    }
  });
}());
