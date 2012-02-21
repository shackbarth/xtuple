
/** 
  @class 
  
  The XT.Object class is the base class for nearly all custom
  objects in the xt framework for node.js server.
  
  @param {Object} [hashes] Hashes or a hash to extend from.
  @returns {Object} A new instance of an XT.Object or child of XT.Object.
*/
XT.Object = function() { 
  this.__super__ = XT.Object.prototype;
  return XT.__init__.apply(this, arguments[0]); 
}

//.............................................
// Class Extensions
//
// These methods make using XT.Object's more convenient and allow
// for easy extensibility and inheritance.
XT.mixin(XT.Object,
  /** @lends XT.Object */ {
  
  /**
    Creates a new object based on this object type. Accepts hashes
    for extension that will create either a new class type as a singleton
    or simply a new object of this type with properties initialized to
    the given values.
    
    @param {Object} [hashes] Mixins to be added to the object.
    @returns {Object} An instance of the [extended] object.
  */
  create: function create() { 
    var c = this, r = new c(arguments); return r; 
  },
  
  /**
    Extends the base object with the given properties. It creates a new class
    that inherits from the base. Can take any number of key-value hashes to
    extend the base with that redefine it as a new class or simply the same base
    class with different properties at initialization.
    
    @param {Object} [hashes] Mixins to be added to the object.
    @returns {Object} An extended prototype.
  */
  extend: function extend() {
    var r = function() { return XT.__init__.apply(this, arguments[0]); },
        l = arguments.length,
        i = 0, k, p;
    for(k in this)
      if(!this.hasOwnProperty(k)) continue;
      else r[k] = this[k];
    if(this.hasOwnProperty('toString')) r.toString = this.toString;
    p = (r.prototype = XT.__sire__(this.prototype));
    for(; i<l; ++i)
      XT.__proto_extend__(p, arguments[i], this.prototype);
    p.constructor = r;
    p.__super__ = this.prototype;
    return r;
  },
  
  /**
    Simple mechanism to differentiate between instance and class.
    
    @return {String} Formatted name of the class.
  */
  toString: function() { 
    var c = this.className
      || this.prototype.className;
    return "[ CLASS: %@ ]".format(c);
  },

  /**
   Camelizes object property names after removing '_' and ' '.

   @return {Object} with camelized property names.
  */
  camelize: function(b) {
    var b = b ? b : this,
        v, t;

    for(var k in this) {
      if(!this.hasOwnProperty(k)) continue;
      v = this[k];
      t = k.camelize();
      if(k !== t) {
        b[t] = v;
        delete this[k];
      };
    };
    return b;
  },

  /**
   Decamelizes object property names, adding '_' between (formerly) camelized values.

   @return {Object} with decamelized property names.
  */
  decamelize: function(b) {
    var b = b ? b : this,
        v, t;

    for(var k in this) {
      if(!this.hasOwnProperty(k)) continue;
      v = this[k];
      t = k.decamelize();
      if(k !== t) {
        b[t] = v;
        delete this[k];
      };
    };
    return b;
  }
});

/** @lends XT.Object.prototype */
XT.Object.prototype = {
  
  /** @private
    
    @todo This has things to do...
  */
  init: function() {},
  
  /**
    Set a property on the given object to be equal to a specified
    value. This is essentially meta-data of the object and can be
    referenced and manipulated many ways but also allows for types
    of notifications to take place.
    
    @param {String} key The key/path for the property to set (relative).
    @param {Object} value The object (any type) to place at path.
    @returns {Object} Callee for chaining.
  */
  set: function() {
    return XT.__set__.apply(this, arguments);
  },
  
  /**
    Retrieve a value for the given property path on the object.
    
    @param {String} key The key to lookup and retrieve.
    @returns {Object|Boolean} The value for the key or undefined if not found.
  */
  get: function() {
    return XT.__get__.apply(this, arguments);
  },
  
  /**
    Each class should have a name. This name is used in several
    ways of matching types, retrieving classes from strings,
    comparisons, etc.

    @private
  */
  className: 'XT.Object',
  
  /**
    The map of custom event handlers and their methods to execute
    for removal purposes. This is a native property used by
    EventEmitter.

    @private
  */ 
  _events: null,

  /**
    Adds an event handler to process when a particular event is
    encountered.

    @param {String} event The event to listen for.
    @param {Function} func The function to execute when the event is encountered.
    @returns {Object} Receiver
  */
  addEvent: function(e, f) {

    // originally this was more complex and perhaps should be but
    // this is a simple implementation that uses native methods
    // for now
    this.addListener(e, f);
  },

  /**
    Allows an event to be removed. NOTE it removes ALL listeners for the
    event.

    @param {String} event The name of the event to stop listening for.
    @returns {Object} Receiver
  */
  removeEvent: function(e) {
    this.removeAllListeners(e);
  },

  /**
    While this method can be overridden, most cases it won't be.
    It provides a consistent, accurate and relatively convenient
    human-readable output for debugging (mostly) but sometimes
    comparisons.
    
    @returns {String} The string for the object.
    @private
  */
  toString: function toString() {
    var c = this.className || 'NOCLASS',
        g = this.uid || 'NOUID';
    return "[ %@ (%@) ]".format(c, g);
  },

  /**
    Length is an arbitrary (and somewhat ambiguous) property
    that should really only be available on enumerable
    implementations but, for now, is available on all xt objects
    while not always useful or meaningful.

    It attempts to determine a meaningful value based solely on
    properties owned by the object instance and should be accessed
    via the get method.

    @example 
      var len = this.get('length')

    @returns {Number} The number of unique properties owned by the object.
    @public
  */
  length: function() {
    var c = [];
    for(var k in this)
      if(!this.hasOwnProperty(k)) continue;
      else c.push(k);
    return c.length;
  }.property(),

  /** @private */
  __xt_object__: YES
}

// We want for XT.Objects to inherit from EventEmitter so they can
// automatically handle events. Obviously there is a tradeoff by
// supplying it to all XT.Objects but it appears to handle things
// well enough.
XT.mixin(XT.Object.prototype, require('events').EventEmitter.prototype);
