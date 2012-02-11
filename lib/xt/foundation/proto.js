
/** @namespace
  The proto namespace is a mixture of common prototypal modifications
  to core JavaScript (and a few others) objects. They are placed here
  to be included for the entire application to make use of. These 
  features are generally convenience methods that have been tested in
  the context of their use in this application only.
*/
xt.proto = { /** xt.proto.prototype */ }

/** xt.string */        require('./string');
/** xt.function */      require('./function');

// xt.mixin(Object.prototype, 
xt.mixin(xt, {
  ////// ----- /** @lends Object.prototype */ {
  
  keys: function(obj) {
    var c = [];
    for(var k in obj)
      if(!obj.hasOwnProperty(k)) continue;
      else c.push(k);
    return c;
  },
   
  /** @public
    @see xt.object.camelize
  */
  camelize: function(obj) {
    return xt.object.camelize.call(obj);
  },
   
  /** @public
    @see xt.object.camelize
  */
  cml: function(obj) {
    return xt.object.camelize.call(obj);
  },
   
  /** @public
    @see xt.object.camelize
  */
  decamelize: function(obj) {
    return xt.object.decamelize.call(obj);
  }
 
});

xt.mixin(Array.prototype, 
  /** @lends Array.prototype */ {
  
  contains: function(needle) {
    var i = 0,
        l = this.length;
    for(; i<l; ++i)
      if(this[i] === needle) return YES;
    return NO;
  }
  
}) ;

xt.mixin(Function.prototype, 
   /** @lends Function.prototype */ {

  /**
    @see xt.function.property
  */
  property: function() {
    return xt.function.property(this);
  },

  /**
    @see xt.function.by
  */
  by: function() {
    var i=0, len = arguments.length;
    for(; i<len; ++i)
      xt.function.by(this, arguments[i]);
    return this;
  }
}) ;

xt.mixin(String.prototype, 
  /** @lends String.prototype */ {
  
  /** @public
    @see xt.string.format
  */
  format: function() {
    return xt.string.format.apply(this, arguments);
  },
  
  /** @public
    @see xt.string.format
  */
  f: function() {
    return xt.string.format.apply(this, arguments);
  },

  /** @public
    @see xt.string.w
  */
  w: function() {
    return xt.string.w.apply(this, arguments);
  },
  
  /** @public
    @see xt.string.capitalize
  */
  capitalize: function() {
    return xt.string.capitalize.apply(this, arguments);
  },

  /** @public
    @see xt.string.capitalize
  */
  cap: function() {
    return xt.string.capitalize.apply(this, arguments);
  },

  /** @public
    Camelize and capitalize the string.
  */
  h: function() {
    return this.c().cap();
  },
  
  /** @public
    @see xt.string.trim
  */
  trim: function trim() {
    return xt.string.trim.apply(this, arguments);
  },
  
  /** @public
    @see xt.string.pre
  */
  pre: function pre() {
    return xt.string.pre.apply(this, arguments);
  },

  /** @public
    @see xt.string.camelize
  */
  camelize: function() {
    return xt.string.camelize.apply(this,arguments);
  },

  /** @public
    @see xt.string.camelize
  */
  c: function() {
    return xt.string.camelize.apply(this,arguments);
  },

  /** @public
    @see xt.string.camelize
  */
  decamelize: function() {
    return xt.string.decamelize.apply(this,arguments);
  }

});
