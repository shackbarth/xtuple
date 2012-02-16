
/** @namespace
  The proto namespace is a mixture of common prototypal modifications
  to core JavaScript (and a few others) objects. They are placed here
  to be included for the entire application to make use of. These 
  features are generally convenience methods that have been tested in
  the context of their use in this application only.
*/
XT.proto = { /** XT.proto.prototype */ }

/** XT.String */        require('./string');
/** XT.Function */      require('./function');

// XT.mixin(Object.prototype, 
XT.mixin(XT,
  /** @lends XT */ {
  
  /**
  */
  keys: function(obj) {
    var c = [];
    for(var k in obj)
      if(!obj.hasOwnProperty(k)) continue;
      else c.push(k);
    return c;
  },
   
  /**
    @see XT.Object.camelize
  */
  camelize: function(obj) {
    return XT.Object.camelize.call(obj);
  },
   
  /**
    @see XT.Object.camelize
  */
  cml: function(obj) {
    return XT.Object.camelize.call(obj);
  },
   
  /**
    @see XT.Object.camelize
  */
  decamelize: function(obj) {
    return XT.Object.decamelize.call(obj);
  }
 
});

XT.mixin(Array.prototype, 
  /** @lends Array.prototype */ {
  
  contains: function(needle) {
    var i = 0,
        l = this.length;
    for(; i<l; ++i)
      if(this[i] === needle) return YES;
    return NO;
  }
  
}) ;

XT.mixin(Function.prototype, 
   /** @lends Function.prototype */ {

  /**
    @see XT.Function.property
  */
  property: function() {
    return XT.Function.property(this);
  },

  /**
    @see XT.Function.by
  */
  by: function() {
    var i=0, len = arguments.length;
    for(; i<len; ++i)
      XT.Function.by(this, arguments[i]);
    return this;
  }
}) ;

XT.mixin(String.prototype, 
  /** @lends String.prototype */ {
  
  /** @public
    @see XT.string.format
  */
  format: function() {
    return XT.string.format.apply(this, arguments);
  },
  
  /** @public
    @see XT.string.format
  */
  f: function() {
    return XT.string.format.apply(this, arguments);
  },

  /** @public
    @see XT.string.w
  */
  w: function() {
    return XT.string.w.apply(this, arguments);
  },
  
  /** @public
    @see XT.string.capitalize
  */
  capitalize: function() {
    return XT.string.capitalize.apply(this, arguments);
  },

  /** @public
    @see XT.string.capitalize
  */
  cap: function() {
    return XT.string.capitalize.apply(this, arguments);
  },

  /** @public
    Camelize and capitalize the string.
  */
  h: function() {
    return this.c().cap();
  },
  
  /** @public
    @see XT.string.trim
  */
  trim: function trim() {
    return XT.string.trim.apply(this, arguments);
  },
  
  /** @public
    @see XT.string.pre
  */
  pre: function pre() {
    return XT.string.pre.apply(this, arguments);
  },

  /** @public
    @see XT.string.camelize
  */
  camelize: function() {
    return XT.string.camelize.apply(this,arguments);
  },

  /** @public
    @see XT.string.camelize
  */
  c: function() {
    return XT.string.camelize.apply(this,arguments);
  },

  /** @public
    @see XT.string.camelize
  */
  decamelize: function() {
    return XT.string.decamelize.apply(this,arguments);
  }

});
