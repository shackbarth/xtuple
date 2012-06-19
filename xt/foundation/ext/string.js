
/**
*/
XT.String = {
  
  /**
  Localize the string.
  
  TODO: Make me do something.
  */
  loc: function() {
    return this.toString();
  },
  
  /**
  */
  format: function() {
    if (arguments.length === 0) return this;
    
    var args = Array.prototype.slice.call(arguments);
    var idx = 0;
    var str = this;
    var type;
    var arg;
    
    for (; idx < args.length; ++idx) {
      arg = args[idx];
      if (!arg) continue;
      type = typeof arg;
      if (type === "object") {
        str = XT.String.replaceKeys(str, arg);
      } else if (type === "string" || type === "number") {
        str = str.replace(/\%@/, arg);
      } else { continue; }
    }
    
    return str;
  },
  
  /**
  */
  replaceKeys: function(str, hash) {
    if (typeof str !== "string") return "";
    if (typeof hash !== "object") return str;
    
    var regex;
    var key;
    var expr;
    var value;
    
    for (key in hash) {
      if (hash.hasOwnProperty(key)) {
        expr = "{" + key + "}";
        regex = new RegExp(expr, "g");
        value = hash[key];
        str = str.replace(regex, value);
      }
    }
    
    return str;
  },
  
  /**
  */
  trim: function trim() {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  }
  
};