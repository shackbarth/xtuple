/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

//........................................
// DEFINE GLOBAL NAMESPACE
//
XT = {};

(function () {
  "use strict";

  var _fs, _path, _;
  
  _path = XT.path = require("path");
  _fs   = XT.fs   = require("fs");
  _     = XT._    = require("underscore");

  XT.util         = require("util");
  XT.http         = require("http");
  XT.https        = require("https");
  XT.url          = require("url");
  XT.crypto       = require("crypto");
  
  XT.connect      = require("connect");
  XT.pg           = require("pg").native;
  XT.mongoose     = require("mongoose");
  
  XT.$P = function () { return this; };
  XT.$K = function () {};
  XT.$A = function (obj) {
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
  
  XT.extend = function (override) {
    var args = XT.$A(arguments).slice(1),
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
  
  XT.protoExtend = function (base, ext) {
    base = XT.extend(true, base, ext);
    return base;
  };
  
  XT.sire = function (base) {
    var K = XT.$P, ret;
    K.prototype = base;
    ret = new K();
    K.prototype = null;
    ret._super = base;
    return ret;
  };
  
  XT.isObject = function (obj) {
    if (XT.none(obj)) return false;
    if (
      obj.constructor && obj._super && obj._XT_OBJECT
    ) return true;
    return false;
  };
  
  XT.mixin = function () {
    var args = XT.$A(arguments);
    args.unshift(true);
    return XT.extend.apply(this, args);
  };

  XT.complete = function () {
    var args = XT.$A(arguments);
    args.unshift(false);
    return XT.extend.apply(this, args);
  };
  
  XT.addEvents = function (func, events) {
    //console.log("XT.addEvents(): ", func, events);
    var i = 0, len = events.length;
    for (; i < len; ++i) this.addEvent(events[i], func);
  };
  
  XT.mixin({

    none: function (obj) {
      return !! (_.isNull(obj) || typeof obj === XT.T_UNDEFINED);
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
      if (XT.none(obj)) {
        if (typeof obj === XT.T_UNDEFINED) return XT.T_UNDEFINED;
        else return XT.T_NULL;
      }
      if (XT._.isFunction(obj)) return XT.T_FUNCTION;
      else if (_.isNumber(obj)) return XT.T_NUMBER;
      else if (_.isBoolean(obj)) return XT.T_BOOLEAN;
      else if (_.isString(obj)) return XT.T_STRING;
      else if (_.isArray(obj)) return XT.T_ARRAY;
      else if (_.isRegExp(obj)) return XT.T_REGEX;
      else {
        if (XT.isObject(obj)) return XT.T_OBJECT;
        else return XT.T_HASH;
      }
    },
    
    kindOf: function (obj, ctor) {
      if (XT.none(obj) || !obj.constructor) return false;
      return !! (obj.constructor === ctor);
    },
    
    init: function () {
      var args = XT.$A(arguments),
          len = args.length, i = 0, key;
      for (; i < len; ++i) XT.extend.call(this, true, args[i]);
      this.uid = _.uniqueId("_xt_");
      for (key in this) {
        if (XT.typeOf(this[key]) === XT.T_FUNCTION) {
          if (this[key].events && this[key].events.length > 0) {
            XT.addEvents.call(this, this[key], this[key].events);
          }
        }
      }
      if (this.init) this.init.call(this);
    },
    
    set: function () {
      var args, path, value, cur, i, parts, tmp;
      if (arguments.length < 2) return this;
      args = arguments;
      path = args[0];
      value = args[1];
      cur = this;
      i = path.indexOf(".");
      while (i === 0) {
        path = path.slice(1);
        i = path.indexOf(".");
      }
      if (i === -1) this[path] = value;
      else {
        parts = path.split(".");
        while (parts.length > 0) {
          tmp = parts.shift();
          if (parts.length === 0) cur[tmp] = value;
          else {
            if (XT.none(cur[tmp])) cur[tmp] = {};
            cur = cur[tmp];
          }
        }
      }
      if (this.emit) process.nextTick(_.bind(this.emit, this, path, path, value));
      return this;
    },
  
    run: function (func) {
      var queue = XT.runQueue || (XT.runQueue = []);
      if (!XT.isReady) queue.push(func);
      else func();
    },
    
    isReady: false,
  
    runQueue: [],
  
    hasBecomeReady: false,
  
    didBecomeReady: function () {
      var wasReady = XT.hasBecomeReady,
          queue = XT.runQueue;
      if (wasReady) return;
      while (queue.length > 0) (queue.shift())();
      XT.runQueue = null;
      XT.hasBecomeReady = true;
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
        type = XT.typeOf(cur[path]);
        if (type === XT.T_OBJECT) value = cur[part].get(path);
        else if (type === XT.T_HASH) value = XT.get.call(cur[part], path, true);
        else return undefined;
      }
      if (XT.typeOf(value) === XT.T_FUNCTION && value.isProperty === true) {
        if (XT.none(args[1])) return value.call(this);
      }
      return value;
    },
    
    json: function (json, emitExceptions) {
      var type = XT.typeOf(json);
      try {
        if (type === XT.T_HASH) json = JSON.stringify(json);
        else if (type === XT.T_STRING) json = JSON.parse(json);
      } catch (err) { if (emitExceptions) throw err; }
      return json ? json : undefined;
    },
    
    cleanup: function () {
      var queue = this.cleanupQueue || [], task;
      if (queue.length <= 0) {
        XT.log("All done. See ya.");
        process.exit(0);
      }
      task = queue.shift();
      if (task) {
        // TODO: come back and do the elaborate check if it
        // is taking too long test so that it won't hang if
        // a cleanup task fails
        task.once("isComplete", _.bind(this.cleanup, this));
        task.exec();
      }
    },
    
    addCleanupTask: function (task, context) {
      var queue = this.cleanupQueue || (this.cleanupQueue = []);
      task = XT.CleanupTask.create({ task: task, context: context });
      queue.push(task);
    },
  
    addProperties: function (base) {
      var args, value, part, i = 0;
      args = XT.$A(arguments).slice(1);
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
    
    setup: function (options) {
      var name, option, prop, unused;
      if (XT.isSetup) return;
      if (!options) {
        this.isSetup = true;
        return;
      }
      unused = this.options = {};
      for (name in options) {
        if (!options.hasOwnProperty(name)) continue;
        option = options[name];
        if (XT.typeOf(option) === XT.T_FUNCTION) {
          option(XT);
        } else {
          if (XT.typeOf(option) === XT.T_HASH) {
            for (prop in option) {
              if (!option.hasOwnProperty(prop)) continue;
              if (XT[name]) XT[name][prop] = option[prop];
              else XT.addProperties(unused, name, prop, option[prop]);
            }
          } else {
            XT.addProperties(XT, name, option);
          }
        }
      }
      XT.isSetup = true;
      if (XT.autoStart) XT.didBecomeReady();
    }
  });
    
  require("./proto");
  require("./object");
  require("./io");
  require("./exception");
  require("./filesystem");
  require("./ext/cleanup_task");
}());