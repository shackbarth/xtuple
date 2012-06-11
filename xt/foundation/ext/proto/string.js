
/**
*/
enyo.mixin(String.prototype,
  /** @scope String.prototype */ {

  /**
  */
  format: function() {
    return XT.String.format.apply(this, arguments);
  },
  
  /**
  */
  f: function() {
    return XT.String.format.apply(this, arguments);
  },
  
  /**
  */
  trim: function() {
    return XT.String.trim.call(this);
  }
    
});