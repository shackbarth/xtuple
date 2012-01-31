
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

xt.mixin(Object.prototype, 
  /** @lends Object.prototype */ {
  
  keys: function() {
    var c = [];
    for(var k in this)
      if(!this.hasOwnProperty(k)) continue;
      else c.push(k);
    return c;
  },
   
  /** @public
    @see xt.object.camelize
  */
  camelize: function() {
    return xt.object.camelize.call(this);
  },
   
  /** @public
    @see xt.object.camelize
  */
  cml: function() {
    return xt.object.camelize.call(this);
  }
});

xt.mixin(Array.prototype, 
  /** @lends Array.prototype */ {

  /**
    @see underscore#each
  */
  each: function(list, iterator, context) {
    var args = args();
    return _.each.call(args); 
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
    @see xt.string.capitalize
  */
  capitalize: function() {
    return xt.string.capitalize.apply(this, arguments);
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
  }
});
