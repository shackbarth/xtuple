/** 
  @class

  Object for simplified string-buffer-like operations. Really
  for convenience only as it has some overhead.

  @example

    Example usage
    
    var buf = xt.string.buffer.create(); // or xt.io.buff() for same result
    buf.push("one string", "two string", "three string");
    buf.set("color", "blue");
    buf.set("prefix", "SAMPLE >> ");
    
    var out = buf.flush(); // => `SAMPLE >> one string two string three string`

*/
xt.string.buffer = xt.object.extend(
  /** @lends xt.string.buffer.prototype */ {

  /**
    Push a variable number of string arguments into the buffer.

    @param {String} [strings] String(s) to be added to the buffer.
    @return {Object} Callee for chaining.
  */
  push: function() {
    if(!this.buffer || xt.typeOf(this.buffer) !== xt.t_array)
      this.buffer = [];
    var a = args(),
        i = 0,
        l = a.length;
    for(; i<l; ++i) this.buffer.push(a[i]);
    return this;
  },

  /**
    Concatenate strings in the buffer and return the formatted
    string.

    @returns {String} The concatenated, formatted string from the
      buffer contents.
  */
  flush: function() {
    var b = this.buffer || [],
        i = 0,
        l = b.length, 
        p = this.get('prefix'),
        s = p ? p.trim() + ' ' : '';
    s = xt.colors[this.color](s);
    for(; i<l; ++i) {
      if(xt.typeOf(b[i]) === xt.t_string)
        s += xt.colors[this.color](b[i]);
      else s += ' ' + 
        xt.colors.grey(xt.util.inspect(b[i], NO, 3));
      // if(i+1 != l) s += ' ';
    }
    this.buffer = null;
    return s;
  },

  /**
    The color to produce on color-capable terminal displays.
    @default grey
    @property
  */
  color: 'grey',

  /** 
    The tag to display before the output to the terminal.
    @default Log:
    @property 
  */
  prefix: 'Log:',

  /** @private */
  className: 'xt.string.buffer'
});
