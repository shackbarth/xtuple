
var _fs      = require('fs');
var _path    = require('path');

/** @namespace
  The xt namespace is the primary namespace for all of the node.js
  xt framework. There are many components that makeup the framework
  but all of them belong to the xt namespace exempting third-party
  modules.
  
  It should be noted that some of the base functions and functionality
  of the xt namespace were heavily inspired by or implementation borrowed 
  from SproutCore. They have been adapted to suit specific purposes in this
  context.
*/
XT = { /** XT */ }

/**
  The Underscore library of functions can be used from globals or
  directly from within the xt namespace.

  @memberOf xt
  @public
*/
_ = XT._ = require('underscore'); // we load this here because it is used immediately


// Core modules being included for convenience
XT.util         = require('util');
XT.http         = require('http');
XT.url          = require('url');
XT.crypto       = require('crypto');
XT.path         = require("path");

XT.connect      = require('connect');
XT.pg           = require('pg');
XT.watch        = require('watch');
XT.dive         = require('diveSync');
XT.mongoose     = require('mongoose');

//.........................................
// Globals
//

/**
  From within a function call args() to receive an
  array of the arguments passed into that function.

  @example
    var foo = function() {
      var args = args(); // returned as native array not arguments object
    }
  
  @returns {Array} Array of arguments or an empty array.
  @public 
*/
args = function() {
  var a = arguments.callee.caller.arguments;
  if(!a || !a.length) return [];
  return Array.prototype.slice.call(a);
}

/**
  Used in object creation to provide an object and an extensible prototype.
  
  @returns {Object} A constructor.
  @private
*/
XT.__p__  = function() { return this; }

/**
  Will extend a base object with the properties of any
  objects passed to it. Usually not called directly, should
  use XT.mixin or XT.complete.
  
  @param {Boolean} override Indicates whether or not to override properties.
  @param {Object} base The object to extend.
  @param {Object} [extensions] Object or objects to use as extensions to the base.
  @returns {Object} The extended base object.
  @private
*/
XT.__extend__ = function __extend__(override) {  
  var args = Array.prototype.slice.call(arguments, 1);
  var numArgs = args.length;
  var base = numArgs > 1 ? args[0] : this || {};
  var idx = 0;
  var proto;
  var temp;
  var key;
  var cur;

  for (; idx < numArgs; ++idx) {

    // ignore null or undefined requests
    if (!(proto = args[idx])) continue;
    
    // iterate over the properties in this hash
    for (key in proto) {
      if (!proto.hasOwnProperty(key)) continue;
      temp = proto[key];

      // if it is a circular reference somehow, ignore it
      if (base === temp) continue;

      // if override is true or the base class does not
      // already have a key for this, replace it
      if (temp !== undefined && (override || base[key] === undefined)) {

        // if it is a function try and see if we can set the
        // super class value of it for chaining
        if (temp instanceof Function) {
          if (base[key] && base[key] instanceof Function) {
            cur = base[key];
            base[key] = temp;
            temp.base = cur;   
          } else {

            // assign it a generic so it won't have some ugly
            // fail every time its called unnecessarily
            base[key] = temp;
            temp.base = XT.__p__;
          }
        } else {

          // normal case plug and chug
          base[key] = temp;
        }
      }
    }
  }
  return base;
}

/**
  Extends the prototype of an object and optionally a super class.
  
  @param {Object} proto The prototype to extend.
  @param {Object} from The object whose properties will extend the prototype.
  @param {Object} [super] The super class.
  @returns {Object} The extended prototype.
  @private
*/
XT.__proto_extend__ = function __proto_extend__(b, e, s) {
  b = XT.__extend__(true, b, e);
  if(e.hasOwnProperty('toString'))
    b.toString = e.toString;
  return b;
}

/**
  Creates a new object from the given prototype.
  
  @param {Object} proto The prototype for the new object.
  @returns {Object} An instance of the sired object.
  @private
*/
XT.__sire__ = function __sire__(b) {
  var n = XT.__p__, r;
  n.prototype = b;
  r = new n;
  n.prototype = null;
  return r;
}

/**
  Tests whether or not the object is an XT.Object. Returns
  true on positive evaluation, false on negative evaluation.
  Instead of calling this directly, call XT.typeOf and test for
  XT.T_OBJECT since that method implements this method to determine
  type or XT.kindOf to directly compare them.
  
  @see xt#kindOf
  @see xt#typeOf

  @param {Object} obj The object to test as an XT.Object.
  @returns {Boolean} true|false
  @private
*/
XT.__isObject__ = function __isObject__(o) {
  if(XT.none(o)) return false;
  if(
    o.constructor
    && o.__super__
    && o.__XT_OBJECT__
    && o.__proto__
  ) return true;
  return false;
}

/**
  Will extend the target object by the properties in any of the
  additional objects passed to it. Any common keys on the base will
  be overridden by the properties of the last object to supply a
  value for the key. If you wish to only add keys that did not
  previously exist use XT.complete. Unlike XT.complete, any common
  properties that exist will be replaced by the last mixin with
  the property with few exceptions.

  @see xt#complete
  
  @param {Object} base The object to extend.
  @param {Object} [mixins] Object or objects to use as extensions of base.
  @returns {Object} The extended base.
  @methodOf xt
  @public
*/
XT.mixin = function mixin() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(true);
  return XT.__extend__.apply(this, args);
}

/**
  Will extend the target object by any properties in any of the
  additional objects passed to it that it did not previously have.
  Unlike XT.mixin, common properties will not be replaced.

  @see xt#mixin
  
  @param {Object} base The object to extend.
  @param {Object} [mixins] Object or objects to use as extensions of base.
  @returns {Object} The extended base.
  @methodOf xt
  @public
*/
XT.complete = function complete() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(false);
  return XT.__extend__.apply(this, args);
}

/**
  Will add named events to xt objects so they will know to trigger
  the correct method when receiving the event.

  @see xt#function#by

  @param {Object} func The function to receive the events.
  @param {Array} events The array of events.
  @methodOf xt
  @private
*/
XT.__addEvents__ = function(func, events) {
  var i=0, len = events.length;
  for(; i<len; ++i)
    this.addEvent(events[i], func);
}

XT.mixin(
  /** @lends xt */ {
  
  /**
    Determine if the given variable is nullish.
    
    @param {Object} obj The object to test for nullishness.
    @returns {Boolean} true|false
    @public
  */
  none: function none(o) {
    return !!(_.isNull(o) || typeof o === XT.T_UNDEFINED);
  },
  
  //..................................................
  // Globals
  //

  /** @property */
  T_STRING:     'string',

  /** @property */
  T_OBJECT:     'object',

  /** @property */
  T_NULL:       'null',

  /** @property */
  T_CLASS:      'class',

  /** @property */
  T_HASH:       'hash',

  /** @property */
  T_FUNCTION:   'function',

  /** @property */
  T_UNDEFINED:  'undefined',

  /** @property */
  T_NUMBER:     'number',

  /** @property */
  T_BOOLEAN:    'boolean',

  /** @property */
  T_ARRAY:      'array',

  /** @property */
  T_REGEX:      'regex',

  /** @property */
  T_ERROR:      'error',
  
  // @todo This needs to be read from the configuration file.
  version: '0.1.1Alpha',
  
  /**
    Determines the object type.

    @todo Does not yet handle error types.
    
    @param {Object} obj The object being tested.
    @returns {String} The appropriate data type for the object being tested.
    @public
  */
  typeOf: function typeOf(o) {
    if(XT.none(o)) { 
      if(typeof o === XT.T_UNDEFINED) return XT.T_UNDEFINED;
      else return XT.T_NULL;
    }
    if(XT._.isFunction(o)) return XT.T_FUNCTION;
    else if(_.isNumber(o)) return XT.T_NUMBER;
    else if(_.isBoolean(o)) return XT.T_BOOLEAN;
    else if(_.isString(o)) return XT.T_STRING;
    // else if(_.isArray(o) || !XT.none(o.length)) return XT.T_ARRAY;
    else if(_.isArray(o)) return XT.T_ARRAY;
    else if(_.isRegExp(o)) return XT.T_REGEX;
    else {
      if(XT.__isObject__(o)) return XT.T_OBJECT;
      else return XT.T_HASH;
    }
  },
  
  /**
    Determines if the object inherits from the constructor.
    
    @param {Object} obj The object to compare.
    @param {Object} constructor The constructor to compare with.
    @returns {Boolean} true|false
    @public
  */
  kindOf: function kindOf(o, c) {
    if(XT.none(o) || !o.constructor) return false;
    return !!(o.constructor === c);
  },
  
  /**
    Initialization routine for objects based on XT.Object.
    
    @param {Object} [mixins] Mixins to extend the XT.Object instance.
    @returns {Object} Instance of XT.Object.
    @private
  */
  __init__: function __init__() {
    var l = arguments.length,
        i = 0;
    for(; i<l; ++i) { XT.__extend__.call(this, true, arguments[i]); }
    this.uid = _.uniqueId('_xt_');

    // need to find if there are any methods that are triggered
    // by events
    for(var k in this) {
      if(typeof this[k] === 'function') {
        if(this[k].events && this[k].events.length > 0) {
          XT.__addEvents__.call(this, this[k], this[k].events);
        }
      }
    }

    if(XT.typeOf(this.init) === XT.T_FUNCTION) this.init.call(this);

    return this;
  },
  
  /**
    @see xt#object#set
    @private
  */
  __set__: function __set__() {
    if(arguments.length < 2) return this;
    var a = arguments,
        p = a[0],
        v = a[1], 
        c = this,
        i = p.indexOf('.'), s, t;
    
    // @todo Should really throw warnings when fail cases occur
    
    // @todo Maybe regex instead?
    while(i == 0) {
      p = p.slice(1);
      i = p.indexOf('.');
    }
    if(!~i)
      this[p] = v;
    else {
      s = p.split('.');
      while(s.length > 0) {
        t = s.shift();
        if(s.length == 0) c[t] = v;
        else {
          if(XT.none(c[t]))
            c[t] = {};
          c = c[t];
        }
      }
    }

    // this is a very simple implementation to trigger
    // events when explicit paths are set
    // but should probably be extended to do some more
    // robust notifications, chains, etc.
    // functions on the object that are set with the 'by'
    // method and whose parameter was the path just
    // set will be triggered with the path and value as
    // the parameters
    if(this.emit) this.emit(p, p, v);
    
    return this;
  },

  /**
    Execute the method when the framework is completely
    ready to run. If the framework is ready, the function
    will be executed immediately.

    @param {Function} func The function to execute.
  */
  run: function run(func) {
    var isReady = XT.isReady;
    var queue = XT._xt_runQueue || [];
    if (!isReady) {
      queue.push(func);
      XT._xt_runQueue = queue;
    } else { func(); }
  },

  /**
    Once the framework is available this will be
    true.

    @type Boolean
    @default false
  */
  isReady: false,

  /** @private */
  _xt_runQueue: [],

  /** @private */
  _xt_hasBecomeReady: false,

  /**
    Flushes any methods waiting to be executed on the
    frameworks ready state changing.

    @private
  */
  didBecomeReady: function() {
    var wasReady = XT._xt_hasBecomeReady;
    var queue = XT._xt_runQueue || [];
    var idx = 0;
    var method;

    // don't need to do this more than once
    if(wasReady) return;

    for (; idx < queue.length; ++idx) {
      method = queue[idx];
      method(); 
    }

    // free the queue
    XT._xt_runQueue = null;
    XT._xt_hasBecomeReady = true;
  },
  
  /**
    @see xt#object#get
    @private
  */
  __get__: function __get__() {
    if(arguments.length == 0) return undefined;
    var a = arguments,
        t = arguments[0], 
        c = this,
        i = t.indexOf('.'), v, p, k;
    
    // @todo Maybe regex instead?
    while(i == 0) {
      t = t.slice(1);
      i = t.indexOf('.');
    }
    if(!~i)
      v = c[t];
    else {
      p = t.substring(0, i);
      t = t.slice(i);
      k = XT.typeOf(c[p]);
      if(k === XT.T_OBJECT)
        v = c[p].get(t);
      else if(k === XT.T_HASH)

        // for recursive calls we make sure that the sub-routines
        // know not to execute a function-property
        v = XT.__get__.call(c[p], t, true);
      else return undefined;
    }
    if(XT.typeOf(v) === XT.T_FUNCTION && v.isProperty === true)
      if(XT.none(a[1])) // making sure this is not a nested recursion
        return v.call(this);
    return v;
  },
  
  /**
    Takes either a string or an object and converts it to the
    opposing JSON form. If a string is provided it will attempt
    to parse the string into a JSON object - if an object is
    provided it will attempt to parse it into JSON string form.
    This is a synchronous function.
    
    @param {String|Object} json The JSON to convert (either form).
    @param {Boolean} emit Allow/disallow throwing of error.
    @returns {String|Object} The correct JSON form (opposite of argument).
    @throws {XT.warning}
    @public
  */
  json: function json(j, emit) {
    var t = XT.typeOf(j);
    try {
      if(t === XT.T_HASH) {
        j = JSON.stringify(j);
      } else if(t === XT.T_STRING) {
        j = JSON.parse(j);
      }
    } catch(e) { /* issue(XT.warning(e)); */ if(emit) throw e; }
    return j;
  },
  
  cleanup: function cleanup() {
    if(XT.Server) XT.Server.closeAll();
    //if(XT.cache) {
    //  XT.log("Closing connection to cache.");
    //  XT.cache.quit();
    //}
    if(XT.pg) {
      XT.log("Waiting for database pool to drain.");
      XT.pg.end(); 
    }
    XT.log("All done. See ya.");
  },

  addProperties: function(base) {
    var args = Array.prototype.slice.call(arguments).slice(1),
        value = args[args.length-1],
        args = args.slice(0, args.length-1),
        part = base, i;
    for(i=0; i<args.length; ++i) {
      if(!part[args[i]]) {
        part[args[i]] = {};
        if(i == args.length-1)
          part[args[i]] = value;
        else part = part[args[i]];
      }
      else part = part[args[i]];
    }
    return base;
  },
  
  A: function(obj) {
    if (obj === null || obj === undefined) return [];
    if (obj.slice instanceof Function) {
      if (typeof obj === "string") return [obj];
      else return obj.slice();
    }
    
    var ret = [];
    
    // case of function arguments that has length property
    if (obj.length) {
      var len = obj.length;
      while(--len >= 0) ret[len] = obj[len];
      return ret;
    }
    
    // for cases where we just convert the values from an
    // object to an array and discard the keys...
    return _.values(obj);
  }
  
}) ;

XT.$A = XT.A;

/** XT.proto */         require('./proto');
/** XT.Object */        require('./object');
/** XT.io */            require('./io');
/** XT.exception */     require('./exception');
/** XT.filesystem */    require('./filesystem');
