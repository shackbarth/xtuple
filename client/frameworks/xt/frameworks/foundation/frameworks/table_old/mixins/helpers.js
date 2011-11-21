
XT.Helpers = {

  initMixin: function() {},

  /** @private */
  sendEvent: function() {

    // grab the statechart
    var tar = this.get("statechart");

    // if no statechart, try and find a table reference
    if(!tar) tar = this.get("table");

    // if no table, try and grab the pane
    if(!tar) tar = this.get("pane");

    // forward the request along
    tar.sendEvent.apply(tar, arguments);
  },

  /** @private */
  msg: function(msg, log) {
    var str = "%@ (%@): %@".fmt(
      SC._object_className(this.constructor), this.get("_xt_id") || this, msg);
    if(log === YES) {
      console.log(str);
    } else {
      return str;
    }
    if(arguments.length > 2)
      for(var i=2, len=arguments.length; i<len; ++i)
        console.log(arguments[ i ]);
  },

  /** @private */
  keysFrom: function(obj) {
    var arr = [];
    for(var key in obj)
      if(obj.hasOwnProperty(key))
        arr.push(key);
    return arr;
  },

};
