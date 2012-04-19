/** @class

  Object for simplified string-buffer-like operations. Really
  for convenience only as it has some overhead.

  @example

    Example usage
    
    var buf = XT.StringBuffer.create(); // or XT.io.buff() for same result
    buf.push("one string", "two string", "three string");
    buf.set("color", "blue");
    buf.set("prefix", "SAMPLE >> ");
    
    var out = buf.flush(); // => `SAMPLE >> one string two string three string`

*/
XT.StringBuffer = XT.Object.extend(
  /** @lends XT.StringBuffer.prototype */ {

  /**
    Push a variable number of string arguments into the buffer.

    @param {String} [strings] String(s) to be added to the buffer.
    @return {Object} Callee for chaining.
  */
  push: function() {
    if(!this.buffer || XT.typeOf(this.buffer) !== XT.T_ARRAY)
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
    var plain;
    plain = s;
    s = XT.colors[this.color](s);
    for(; i<l; ++i) {
      if(XT.typeOf(b[i]) === XT.T_STRING) {
        s += XT.colors[this.color](b[i]);
        plain += b[i];
      } else {
        s += ' ' + XT.colors.grey(XT.util.inspect(b[i], false, 3));
        plain += XT.util.inspect(b[i], false, 3);
      }
      // if(i+1 != l) s += ' ';
    }
    this.buffer = null;
    return { color: s, plain: plain };
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
  prefix: '<<LOG>>',

  /** @private */
  className: 'XT.StringBuffer'
});
