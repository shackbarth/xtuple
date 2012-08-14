/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";
  
  X.StringBuffer = X.Object.extend({

    init: function () {
      this.buffer = [];
    },

    push: function () {
      var args = X.$A(arguments);
      this.buffer = this.buffer.concat(args);
      return this;
    },

    flush: function () {
      var buff = this.buffer, i = 0, len = buff.length,
          prefix = this.get("prefix"), str, plain;
      str = prefix ? prefix.trim() + " ": "";
      plain = str;
      str = X.colors[this.color](str);
      for (; i < len; ++i) {
        if (X.typeOf(buff[i]) === X.T_STRING) {
          str += X.colors[this.color](buff[i]);
          plain += buff[i];
        } else {
          str += " " + X.colors.grey(X.util.inspect(buff[i], false, 3));
          plain += X.util.inspect(buff[i], false, 3);
        }
      }
      this.buffer = null;
      return { color: str, plain: plain };
    },
    
    color: "grey",
    prefix: "<<LOG>>",
    className: "X.StringBuffer"
  });
}());
