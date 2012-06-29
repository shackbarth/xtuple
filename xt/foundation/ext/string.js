
/**
*/
XT.String = {
  
  /**
    Localize the string.
  */
  loc: function(str) {
    if (!XT.locale) {
      enyo.warn("XT.String.loc(): attempt to localize string but no locale set");
      return str;
    }
    
    var args = XT.$A(arguments);
    var localized = XT.locale.loc(str);
        
    args.shift();
    
    if (args.length > 0) {
      try {
        return XT.String.format(localized, args);
      } catch(err) {
        enyo.error("could not localize string, %@".f(str), err);
      }
    } else { return localized; }
  },
  
  /**
    @NOTE: does not currently detect recursion depth...
  */
  format: function(str, args) {    
    if (arguments.length === 0) return "";
    if (arguments.length === 1) return str;
    
    var idx = 0;
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
  trim: function trim(str) {
    if (!str || !(str instanceof String)) return "";
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  }
  
};