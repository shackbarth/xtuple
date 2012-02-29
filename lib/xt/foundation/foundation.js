
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
// _ = XT._ = require('../../underscore'); // we load this here because it is used immediately
_ = XT._ = require('underscore'); // we load this here because it is used immediately

//.........................................
// Globals
//

/** 
  Borrowed from SproutCore, too convenient...

  @constant 
*/
YES   = true;

/** 
  Borrowed from SproutCore, too convenient...

  @constant 
*/
NO    = false;

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
  var args = Array.prototype.slice.call(arguments, 1),
      l = args.length,
      b = l > 1 ? args[0] : this || {},
      i = 0, p, t, k;
  for(; i<l; ++i) {
    if(!(p = args[i])) continue;
    for(k in p) {
      if(!p.hasOwnProperty(k)) continue;
      t = p[k];
      if(b === t) continue;
      if(t !== undefined && (override || b[k] === undefined)) b[k] = t;
    }
  }
  return b;
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
  b = XT.__extend__(YES, b, e);
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
  @returns {Boolean} YES|NO
  @private
*/
XT.__isObject__ = function __isObject__(o) {
  if(XT.none(o)) return NO;
  if(
    o.constructor
    && o.__super__
    && o.__xT_OBJECT__
    && o.__proto__
  ) return YES;
  return NO;
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
  args.unshift(YES);
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
  args.unshift(NO);
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
    @returns {Boolean} YES|NO
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
    @returns {Boolean} YES|NO
    @public
  */
  kindOf: function kindOf(o, c) {
    if(XT.none(o) || !o.constructor) return NO;
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
    for(; i<l; ++i) { XT.__extend__.call(this, YES, arguments[i]); }
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
        v = XT.__get__.call(c[p], t, YES);
      else return undefined;
    }
    if(XT.typeOf(v) === XT.T_FUNCTION && v.isProperty === YES)
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
  
  /**
    Parses a configuration file if one was provided instead of command-
    line arguments.
    
    @param {String} path The path to the file relative to execution path.
    @private
  */
  parseConfiguration: function parseConfiguration(f) {
    f = XT.fs.__path__.resolve(XT.fs.basePath, f);
    XT.fs.readFile(f, function(e, d) {
      if(e) throw XT.fatal(e);
      XT.mixin(XT.opts, XT.json(d));
      if(XT.opts.debug)
        XT.DEBUGGING = XT.opts.debug;
      XT.fs.readFile(XT.opts['encryption-key-file'], function(err, key) {
        if(err) throw XT.fatal(err);
        XT.ENCRYPTIONKEY = key.trim();
        process.emit('xtReady');
      });
    })
  },

  cleanup: function cleanup() {
    
    XT.Server.closeAll();

    XT.log("Closing connection to cache.");
    XT.cache.quit();

    // auto-waits for drain on all active pools
    XT.log("Waiting for database pool to drain.");
    XT.pg.end(); 
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
  }
}) ;

/** XT.proto */         require('./proto');
/** XT.Object */        require('./object');
/** XT.io */            require('./io');
/** XT.exception */     require('./exception');
/** XT.filesystem */    require('./filesystem');
/** XT.opts */          require('./opts');
