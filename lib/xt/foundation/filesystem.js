/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, issue:true */

(function () {
  "use strict";
  
  var _fs = XT.fs, _path = XT.path;
  
  XT.mixin({

    basePath: process.cwd(),

    directoryFiles: function (path, options, callback) {
      var files;
      if (options) {
        if (XT.typeOf(options) === XT.T_FUNCTION) {
          callback = options;
          options = {};
        }
      } else if (XT.none(options)) options = {};

      path = _path.normalize(path);
      
      try {
        if (XT.typeOf(callback) !== XT.T_FUNCTION) {
          files = _fs.readdirSync(path);
          if (options.extension) {
            files = XT.reduce(files, options.extension);
          }
          return options.fullPath ? files.map(function (file) {
            return _path.join(path, file);
          }) : files;
        } else {
          _fs.readdir(path, function (err, files) {
            if (options.extension) {
              files = XT.reduce(files, options.extension);
            }
            callback(options.fullPath ? files.map(function (file) {
              return _path.join(path, file);
            }) : files);
          });
        }
      } catch (err) {
        XT.warn(err);
        if (XT.typeOf(callback) === XT.T_FUNCTION) {
          callback([]);
        } else { return []; }
      }
    },

    shorten: function (path, max) {
      if (XT.none(max)) max = 3;
      if (XT.none(path) || XT.typeOf(path) !== XT.T_STRING) return path;
  
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
      if (XT.typeOf(filename) === XT.T_FUNCTION) {
        callback = filename;
        filename = '';
      }
      path = _path.join(path, filename);
      try {
        _fs.readFile(path, 'utf-8', callback);
      } catch (err) {
        XT.warn(err);
        callback("");
      }
    },

    ext: function (path) {
      var ext = _path.extname(path);
      return ext.length > 1 ? ext.slice(1) : ext;
    },

    byLine: function (content) {
      if (!content || content.length === 0 || XT.typeOf(content) !== XT.T_STRING) return [];
      return content.split('\n') || [];
    },

    exists: function (path, callback) {
      var stats;
      if (!XT.none(callback) && XT.typeOf(callback) === XT.T_FUNCTION) {
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
        issue(XT.warning(err));
        return false;
      }
    },

    createDir: function (path, callback) {
      _fs.mkdir(path, callback);
    },

    writeFile: function (path, content, callback) {
      if (XT.none(callback) || XT.typeOf(callback) !== XT.T_FUNCTION) {
        _fs.writeFileSync(path, content, 'utf8');
      }
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