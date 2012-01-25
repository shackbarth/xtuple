
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
xt = { /** xt */ }

/**
  The Underscore library of functions can be used from globals or
  directly from within the xt namespace.

  @memberOf xt
  @public
*/
// _ = xt._ = require('../../underscore'); // we load this here because it is used immediately
_ = xt._ = require('underscore'); // we load this here because it is used immediately

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
xt.__p__  = function() { return this; }

/**
  Will extend a base object with the properties of any
  objects passed to it. Usually not called directly, should
  use xt.mixin or xt.complete.
  
  @param {Boolean} override Indicates whether or not to override properties.
  @param {Object} base The object to extend.
  @param {Object} [extensions] Object or objects to use as extensions to the base.
  @returns {Object} The extended base object.
  @private
*/
xt.__extend__ = function __extend__(override) {  
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
xt.__proto_extend__ = function __proto_extend__(b, e, s) {
  b = xt.__extend__(YES, b, e);
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
xt.__sire__ = function __sire__(b) {
  var n = xt.__p__, r;
  n.prototype = b;
  r = new n;
  n.prototype = null;
  return r;
}

/**
  Tests whether or not the object is an xt.object. Returns
  true on positive evaluation, false on negative evaluation.
  Instead of calling this directly, call xt.typeOf and test for
  xt.t_object since that method implements this method to determine
  type or xt.kindOf to directly compare them.
  
  @see xt#kindOf
  @see xt#typeOf

  @param {Object} obj The object to test as an xt.object.
  @returns {Boolean} YES|NO
  @private
*/
xt.__isObject__ = function __isObject__(o) {
  if(xt.none(o)) return NO;
  if(
    o.constructor
    && o.__super__
    && o.__xt_object__
    && o.__proto__
  ) return YES;
  return NO;
}

/**
  Will extend the target object by the properties in any of the
  additional objects passed to it. Any common keys on the base will
  be overridden by the properties of the last object to supply a
  value for the key. If you wish to only add keys that did not
  previously exist use xt.complete. Unlike xt.complete, any common
  properties that exist will be replaced by the last mixin with
  the property with few exceptions.

  @see xt#complete
  
  @param {Object} base The object to extend.
  @param {Object} [mixins] Object or objects to use as extensions of base.
  @returns {Object} The extended base.
  @methodOf xt
  @public
*/
xt.mixin = function mixin() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(YES);
  return xt.__extend__.apply(this, args);
}

/**
  Will extend the target object by any properties in any of the
  additional objects passed to it that it did not previously have.
  Unlike xt.mixin, common properties will not be replaced.

  @see xt#mixin
  
  @param {Object} base The object to extend.
  @param {Object} [mixins] Object or objects to use as extensions of base.
  @returns {Object} The extended base.
  @methodOf xt
  @public
*/
xt.complete = function complete() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(NO);
  return xt.__extend__.apply(this, args);
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
xt.__addEvents__ = function(func, events) {
  var i=0, len = events.length;
  for(; i<len; ++i)
    this.addEvent(events[i], func);
}

xt.mixin(
  /** @lends xt */ {
  
  /**
    Determine if the given variable is nullish.
    
    @param {Object} obj The object to test for nullishness.
    @returns {Boolean} YES|NO
    @public
  */
  none: function none(o) {
    return !!(_.isNull(o) || typeof o === xt.t_undefined);
  },
  
  //..................................................
  // Globals
  //

  /** @property */
  t_string:     'string',

  /** @property */
  t_object:     'object',

  /** @property */
  t_null:       'null',

  /** @property */
  t_class:      'class',

  /** @property */
  t_hash:       'hash',

  /** @property */
  t_function:   'function',

  /** @property */
  t_undefined:  'undefined',

  /** @property */
  t_number:     'number',

  /** @property */
  t_boolean:    'boolean',

  /** @property */
  t_array:      'array',

  /** @property */
  t_regex:      'regex',

  /** @property */
  t_error:      'error',
  
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
    if(xt.none(o)) return xt.t_null;
    if(xt._.isFunction(o)) return xt.t_function;
    else if(_.isNumber(o)) return xt.t_number;
    else if(_.isBoolean(o)) return xt.t_boolean;
    else if(_.isString(o)) return xt.t_string;
    // else if(_.isArray(o) || !xt.none(o.length)) return xt.t_array;
    else if(_.isArray(o)) return xt.t_array;
    else if(_.isRegExp(o)) return xt.t_regex;
    else {
      if(xt.__isObject__(o)) return xt.t_object;
      else return xt.t_hash;
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
    if(xt.none(o) || !o.constructor) return NO;
    return !!(o.constructor === c);
  },
  
  /**
    Initialization routine for objects based on xt.object.
    
    @param {Object} [mixins] Mixins to extend the xt.object instance.
    @returns {Object} Instance of xt.object.
    @private
  */
  __init__: function __init__() {
    var l = arguments.length,
        i = 0;
    for(; i<l; ++i) { xt.__extend__.call(this, YES, arguments[i]); }
    this.uid = _.uniqueId('_xt_');

    // need to find if there are any methods that are triggered
    // by events
    for(var k in this) {
      if(typeof this[k] === 'function') {
        if(this[k].events && this[k].events.length > 0)
          xt.__addEvents__.call(this, this[k], this[k].events);
      }
    }

    if(xt.typeOf(this.init) === xt.t_function) this.init.call(this);
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
          if(xt.none(c[t]))
            c[t] = {};
          c = c[t];
        }
      }
    }
    
    return this;
    
    // @todo Event handling/notifications still missing
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
      k = xt.typeOf(c[p]);
      if(k === xt.t_object || k === xt.t_hash)

        // for recursive calls we make sure that the sub-routines
        // know not to execute a function-property
        v = xt.__get__.call(c[p], t, YES);
      else return undefined;
    }
    if(xt.typeOf(v) === xt.t_function && v.isProperty === YES)
      if(xt.none(a[1])) // making sure this is not a nested recursion
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
    @returns {String|Object} The correct JSON form (opposite of argument).
    @throws {xt.warning}
    @public
  */
  json: function json(j) {
    var t = xt.typeOf(j);
    try {
      if(t === xt.t_hash) {
        j = JSON.stringify(j);
      } else if(t === xt.t_string) {
        j = JSON.parse(j);
      }
    } catch(e) { issue(xt.warn(e)); }
    return j;
  },
  
  /**
    Parses a configuration file if one was provided instead of command-
    line arguments.
    
    @param {String} path The path to the file relative to execution path.
    @private
  */
  parseConfiguration: function parseConfiguration(f) {
    f = xt.fs.__path__.resolve(xt.fs.basePath, f);
    xt.fs.readFile(f, function(e, d) {
      if(e) throw xt.fatal(e);
      xt.mixin(xt.opts, xt.json(d));
      if(xt.opts.debug)
        xt.DEBUGGING = xt.opts.debug === "true" ? YES : NO;
      process.emit('xtReady');
    })
  }
}) ;

/** xt.proto */         require('./proto');
/** xt.object */        require('./object');
/** xt.io */            require('./io');
/** xt.exception */     require('./exception');
/** xt.filesystem */    require('./filesystem');
/** xt.opts */          require('./opts');
