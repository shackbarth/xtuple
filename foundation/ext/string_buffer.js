/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";
  
  XT.StringBuffer = XT.Object.extend({

    init: function () {
      this.buffer = [];
    },

    push: function () {
      var args = XT.$A(arguments);
      this.buffer = this.buffer.concat(args);
      return this;
    },

    flush: function () {
      var buff = this.buffer, i = 0, len = buff.length,
          prefix = this.get("prefix"), str, plain;
      str = prefix ? prefix.trim() + " ": "";
      plain = str;
      str = XT.colors[this.color](str);
      for (; i < len; ++i) {
        if (XT.typeOf(buff[i]) === XT.T_STRING) {
          str += XT.colors[this.color](buff[i]);
          plain += buff[i];
        } else {
          str += " " + XT.colors.grey(XT.util.inspect(buff[i], false, 3));
          plain += XT.util.inspect(buff[i], false, 3);
        }
      }
      this.buffer = null;
      return { color: str, plain: plain };
    },
    
    color: "grey",
    prefix: "<<LOG>>",
    className: "XT.StringBuffer"
  });
}());