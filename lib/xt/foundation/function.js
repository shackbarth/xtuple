
/** @namespace
  This is a collection of methods that are available for
  functions. Some are strictly for convenience while others
  play a significant role in providing a clean and consistent
  api that is typically friendlier and more reusable than
  native protocol can afford.
*/
XT.Function = { /** @lends XT.Function */
  
  /**
    Distinguishes class methods as properties that get
    will recognize and instead of returning the function
    will execute it and return the value. This method
    is used by the native Function object and should not
    be called directly.
    
    @param {Function} func The function to be set as property.
    @returns {Object} The function.
  */
  property: function(t) {
    t.isProperty = YES;
    return t;
  },

  /**
    Sets a function to be executed when a particular event is
    fired on an object capable of event handling (triggered-by).

    @param {Function} func The function to be set as the receiver
    @param {String} event The event to respond to
    @returns {Object} The function.
  */
  by: function(f, e) {
    if(!f.events) f.events = [];
    f.events.push(e);
    return f;
  }

  

}
