
/** @namespace
  This is a collection of methods that are available for
  string manipulation. Some are optimizations and some are merely
  for convenience. Some are available on the native String object
  prototype and are marked private here. Any public method can
  be used from the namespace. The methods added to the prototype
  call these methods so as not to add so much additional code to
  each individual string when they can share.
*/

xt.string = { /** @lends xt.string.prototype */

  /**
    Has the ability to replace keys in the string with
    the contents provided to it. It can handle a hashes
    of key-value pairs and it will replace all keys with
    the matching values throughout the string (not just
    the first reference). It can also handle an indefinite
    number of strings and they will sequentially be inserted
    into the string replacing any `%@` found. These can be
    any number of arguments and be mixed and matched if need
    be.
    
    The keys in the string should be wrapped in curly-braces
    because this is how the regex will look for them.
    
    @example
      var s = "hello {name} you are {adjective}";
      s = s.format({name: 'pooBear', adjective: 'honey-lover'});
    
      or
    
      var s = "hello {name} you are %@";
      s = s.format({name: 'pooBear'}, 'honey-lover');
    
      both will reconcile to
    
      s => "hello pooBear you are honey-lover"

    @param {Object} param The key/value pairs to insert into string.
    @returns {String} The parsed string.
  */
  format: function format() {
    if(arguments.length === 0) return this;
    var args = Array.prototype.slice.call(arguments),
        l = args.length,
        i = 0, 
        self = this, t;
    for(; i<l; ++i) {
      if(xt.none(args[i])) continue;
      t = xt.typeOf(args[i]);
      if(t === xt.t_hash)
        self = xt.string.replaceKeys(self, args[i]);
      else if(t === xt.t_string || t === xt.t_number)
        self = self.replace(/\%@/, args[i]);
      else continue;
    }
    return self;
  },
  
  /**
    Capitalizes the first letter of the string and forces
    the remaining characters of the string to lowercase.
    
    @todo This may not work on translated strings?
    
    @returns {String} The capitalized string.
  */
  capitalize: function capitalize() {
    return this.charAt(0).toUpperCase()+this.slice(1).toLowerCase();
  },
  
  /**
    Trims away whitespace at the beginning and end of the string.
    The implementation selected (since there are a wide variety) tested to
    be the fastest method for normal scenarios.
    
    @returns {String} trimmed string
  */
  trim: function trim() {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  },

  /**
    Prepends a string to the front of the current string. This
    is more convenient, can save a few characters, and arguably
    looks better in code.
    
    @returns {String} string with prepended value as prefix
  */
  pre: function pre(p) {
    if(xt.none(p) || xt.typeOf(p) !== xt.t_string) return this;
    return p + this;
  },
  
  /**
    Takes an object-hash of key-value pairs and globally replaces
    each key with its assigned value anywhere in the string.
    
    @param {String} the string to search and replace in
    @param {Object} the hash of key-value pairs
    @returns {String} the modified string
  */
  replaceKeys: function replaceKeys(s, o) {
    if(xt.none(o) || xt.typeOf(o) !== xt.t_hash) return s;
    if(xt.typeOf(s) !== xt.t_string) return '';
    var r, k, m, v;
    for(k in o) {
      m = '{%@}'.format(k);
      r = new RegExp(m, 'g');
      v = o[k];
      s = s.replace(r, v)
    }
    return s;
  },

 /** 
    Camelizes current string, removing '_' and ' '.

    @returns {String} the modified (camelized) string
 */
  camelize: function camelize() {
    var self = this, ret, first, lower; 
    ret = self.replace( (/([\s|\-|\_|\n])([^\s|\-|\_|\n]?)/g), function(self, separater, character) {
          return character ? character.toUpperCase() : '';
          });
    first = ret.charAt(0);
    lower = first.toLowerCase();
    return first !== lower ? lower + ret.slice(1) : ret;
  },

  /* Decamelizes current string adding '_' between (formerly) camelized values.

     @returns {String} the modified (decamelized) string
  */
  decamelize: function camelize() {
    return this.replace((/([a-z])([A-Z])/g), '$1_$2').toLowerCase(); 
  }
}
