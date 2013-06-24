/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

//........................................
// DEFINE GLOBAL NAMESPACE
//

/**
  X is the single global variable across all node layers that defines
  our namespace.

  @class
  @namespace
  @global
 */
X = {};

(function () {
  "use strict";

  var _fs, _path, _;

  _path = X.path = require("path");
  _fs   = X.fs   = require("fs");
  _     = X._    = require("underscore");

  X.util         = require("util");
  X.https        = require("https");
  X.url          = require("url");
  X.crypto       = require("crypto");
  X.bcrypt       = require("bcrypt");
  X.pg           = require("pg");

  /**
   Returns the global X

   @returns {Object} X
  */
  X.$P = function () { return this; };

  /**
   Returns an empty object
   @returns {Object} An empty object
   */
  X.$K = function () {};

  /**
    Returns the input as an array

    @param obj Any object or array
    @returns {Array} An array version of the input
  */
  X.$A = function (obj) {
    var ret, len;
    if (obj === null || obj === undefined) return [];
    if (obj.slice instanceof Function) {
      if (typeof obj === "string") return [obj];
      else return obj.slice();
    }

    if (obj.length) {
      len = obj.length;
      ret = [];
      while (--len >= 0) ret[len] = obj[len];
      return ret;
    }

    return _.values(obj);
  };

  /**
    Adds a function to X. Used internally.

   @private
   @param {Boolean} override Dictates whether to override pre-existing function
      if it already exists.
   @param [base] Defaults to this if not specified.
   @return {Object} base The base object being extended.
   */
  X.extend = function (override) {
    var args = X.$A(arguments).slice(1),
        len = args.length, i = 0,
        base = len > 1 ? args[0] : this,
        proto, tmp, key, cur;
    for (; i < len; ++i) {
      if (!(proto = args[i])) continue;
      for (key in proto) {
        if (!proto.hasOwnProperty(key)) continue;
        tmp = proto[key];
        if (base === tmp) continue;
        if (tmp !== undefined && (override || base[key] === undefined)) {
          if (tmp instanceof Function) {
            if (base[key] && base[key] instanceof Function) {
              cur = base[key];
              base[key] = tmp;
              if (!base._super) base._super = {};
              base._super[key] = cur;
            } else {
              base[key] = tmp;
            }
          } else {
            base[key] = tmp;
          }
        }
      }
    }
    return base;
  };

  /**
   Extend with an explicit base and extention. This function will automatically override
   any preexisting properties on the base

   @param {Object} base The object to extend.
   @param {Object} ext Object or function extension.
   @returns base
   */
  X.protoExtend = function (base, ext) {
    base = X.extend(true, base, ext);
    return base;
  };

  /**
    Sires.
  */
  X.sire = function (base) {
    var K = X.$P, ret;
    K.prototype = base;
    ret = new K();
    K.prototype = null;
    //ret._super = base;
    return ret;
  };

  /**
   Determines whether the parameter is an object

   @param obj The Object under test.
   @return {Boolean}
  */
  X.isObject = function (obj) {
    if (X.none(obj)) return false;
    if (
      obj.constructor && obj._super && obj._X_OBJECT
    ) return true;
    return false;
  };

  /**
    Adds properties of the parameter into the X object.
    Pre-existing properties of X will be overridden

    @param {Object}
  */
  X.mixin = function () {
    var args = X.$A(arguments);
    args.unshift(true);
    return X.extend.apply(this, args);
  };

  /**
    Adds properties of the parameter into the X object.
    Pre-existing properties of X will not be overridden

    @param {Object}
  */
  X.complete = function () {
    var args = X.$A(arguments);
    args.unshift(false);
    return X.extend.apply(this, args);
  };

  /**
    Adds Events
  */
  X.addEvents = function (func, events) {
    //console.log("X.addEvents(): ", func, events);
    var i = 0, len = events.length;
    for (; i < len; ++i) this.addEvent(events[i], func);
  };

  X.mixin({

    none: function (obj) {
      return !! (_.isNull(obj) || typeof obj === X.T_UNDEFINED);
    },

    T_STRING:     'string',
    T_OBJECT:     'object',
    T_NULL:       'null',
    T_CLASS:      'class',
    T_HASH:       'hash',
    T_FUNCTION:   'function',
    T_UNDEFINED:  'undefined',
    T_NUMBER:     'number',
    T_BOOLEAN:    'boolean',
    T_ARRAY:      'array',
    T_REGEX:      'regex',
    T_ERROR:      'error',

    typeOf: function (obj) {
      if (X.none(obj)) {
        if (typeof obj === X.T_UNDEFINED) return X.T_UNDEFINED;
        else return X.T_NULL;
      }
      if (X._.isFunction(obj)) return X.T_FUNCTION;
      else if (_.isNumber(obj)) return X.T_NUMBER;
      else if (_.isBoolean(obj)) return X.T_BOOLEAN;
      else if (_.isString(obj)) return X.T_STRING;
      else if (_.isArray(obj)) return X.T_ARRAY;
      else if (_.isRegExp(obj)) return X.T_REGEX;
      else {
        if (X.isObject(obj)) return X.T_OBJECT;
        else return X.T_HASH;
      }
    },

    init: function () {
      var args = X.$A(arguments),
          len = args.length, i = 0, key;
      for (; i < len; ++i) X.extend.call(this, true, args[i]);
      this.uid = _.uniqueId("_xt_");
      for (key in this) {
        if (X.typeOf(this[key]) === X.T_FUNCTION) {
          if (this[key].events && this[key].events.length > 0) {
            X.addEvents.call(this, this[key], this[key].events);
          }
        }
      }
      if (this.init) this.init.call(this);
      if (this.postInit) this.postInit.call(this);
    },

    set: function () {
      var args, path, value, cur, i, parts, tmp;
      if (arguments.length < 2) return this;
      args = X.$A(arguments);
      //path = args[0];
      path = args.shift();
      //value = args[1];
      value = args.shift();
      cur = this;
      i = path.indexOf(".");
      while (i === 0) {
        path = path.slice(1);
        i = path.indexOf(".");
      }
      if (i === -1) {
        if (this[path] && this[path] instanceof Function && this[path].isProperty) {
          args.unshift(value);
          this[path].apply(this, args);
        } else this[path] = value;
      } else {
        parts = path.split(".");
        while (parts.length > 0) {
          tmp = parts.shift();
          if (parts.length === 0) {
            if (cur[tmp] && cur[tmp] instanceof Function && cur[tmp].isProperty) {
              args.unshift(value);
              cur[tmp].apply(this, args);
            } else cur[tmp] = value;
          } else {
            if (X.none(cur[tmp])) cur[tmp] = {};
            cur = cur[tmp];
          }
        }
      }
      if (this.emit) process.nextTick(_.bind(this.emit, this, path, path, value));
      return this;
    },

    run: function (func) {
      var queue = X.runQueue || (X.runQueue = []);
      if (!X.isReady) queue.push(func);
      else func();
    },

    isReady: false,

    runQueue: [],

    hasBecomeReady: false,

    didBecomeReady: function () {
      var wasReady = X.hasBecomeReady,
          queue = X.runQueue, required;

      // its an unfortunate oversight that these two variables
      // exist simultaneously...
      X.hasBecomeReady = true;
      X.isReady = true;
      if (wasReady) return;
      while (queue.length > 0) (queue.shift())();
      X.runQueue = null;
    },

    get: function () {
      var args, path, cur, i, value, part, type;
      if (arguments.length === 0) return undefined;
      args = arguments;
      path = args[0];
      cur = this;
      i = path.indexOf(".");
      while (i === 0) {
        path = path.slice(1);
        i = path.indexOf(".");
      }
      if (i === -1) value = cur[path];
      else {
        part = path.substring(0, i);
        path = path.slice(i);
        //type = X.typeOf(cur[path]);
        type = X.typeOf(cur[part]);
        if (type === X.T_OBJECT) value = cur[part].get(path);
        else if (type === X.T_HASH) value = X.get.call(cur[part], path, true);
        else return undefined;
      }
      if (X.typeOf(value) === X.T_FUNCTION && value.isProperty === true) {
        if (X.none(args[1])) return value.call(this);
      }
      return value;
    },

    json: function (json, emitExceptions) {
      var type = X.typeOf(json);
      try {
        if (type === X.T_HASH || type === X.T_ARRAY) json = JSON.stringify(json);
        else if (type === X.T_STRING) json = JSON.parse(json);
      } catch (err) { if (emitExceptions) throw err; }
      return json ? json : undefined;
    },

    cleanup: function (isError) {
      var queue = this.cleanupQueue || [], task;
      X.cleaningUp = true;
      if (X.cleanedUp) return false;
      if (queue.length <= 0) {
        X.log("Exiting with status code = ", isError ? 1 : 0);
        X.cleanedUp = true;
        process.exit(isError ? 1 : 0);
      }
      task = queue.shift();
      if (task) {
        // TODO: come back and do the elaborate check if it
        // is taking too long test so that it won't hang if
        // a cleanup task fails
        task.once("isComplete", _.bind(this.cleanup, this, isError));
        task.exec();
      }
    },

    addCleanupTask: function (task, context) {
      var queue = this.cleanupQueue || (this.cleanupQueue = []);
      task = X.CleanupTask.create({ task: task, context: context });
      queue.unshift(task);
    },

    addProperties: function (base) {
      var args, value, part, i = 0;
      args = X.$A(arguments).slice(1);
      value = args.pop();
      part = base;
      for (; i < args.length; ++i) {
        if (!part[args[i]]) {
          if (i === args.length - 1) part[args[i]] = value;
          else part = part[args[i]] = {};
        } else { part = part[args[i]]; }
      }
      return base;
    },

    writePidFile: function () {
      X.log("Writing pid file '%@'".f(X.pidFileName));
      X.writeFile(X.pidFile, X.pid);
      X.addCleanupTask(X.cleanupPidFile);
    },

    cleanupPidFile: function () {
      if (!X.pidFile) return;
      X.log("Removing pid file.");
      X.removeFile(X.pidFile);
    },

    setup: function (options) {
      var name, option, prop, unused;
      if (X.isSetup) return;
      if (!options) {
        this.isSetup = true;
        return;
      }

      this.options = options;

      X.isSetup = true;
      X.didBecomeReady();
    }
  });

  require("./proto");
  require("./object");
  require("./io");
  require("./exception");
  require("./filesystem");
  require("./ext/cleanup_task");

  (function () {
    var options = "version.txt node_modules/xt/version.txt".w(), i = 0, path;
    for (; i < options.length && X.none(X.version); ++i) {
      path = _path.join(X.basePath, options[i]);
      if (X.exists(path)) X.version = X.readFile(path);
    }
    if (X.none(X.version)) X.version = "UNKNOWN";
  }());

}());
