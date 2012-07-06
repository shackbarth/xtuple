/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  var token   = /\{[a-zA-Z1-9]*\}/g,
      camel   = /([\s|\-|\_|\n])([^\s|\-|\_|\n]?)/g,
      decamel = /([a-z])([A-Z])/g;
  
  var camelizeChar = function () {
    return arguments[2] ? arguments[2].toUpperCase() : "";
  };
  
  XT.String = {};
  
  XT.mixin(XT.String, {

    format: function () {
      var args = XT.$A(arguments), len = args.length,
          i = 0, type, str = this.toString();
      for (; i < len; ++i) {
        if (XT.none(args[i])) continue;
        type = XT.typeOf(args[i]);
        if (type === XT.T_HASH) str = XT.String.replaceKeys(str, args[i]);
        else if (type === XT.T_STRING) str = str.replace(/\%@/, args[i]);
        else if (type === XT.T_NUMBER) str = str.replace(/\%@/, String(args[i]));
        else continue;
      }
    },

    capitalize: function () {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },

    trim: function () {
      return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    },

    pre: function (prefix) {
      return String(prefix) + this;
    },

    suf: function (suffix) {
      return this + String(suffix);
    },

    replaceKeys: function (str, obj) {
      var regex, key, value, tok;
      if (XT.none(obj) || XT.typeOf(obj) !== XT.T_HASH) return str;
      if (XT.typeOf(str) !== XT.T_STRING) return "";
      for (key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        token = "{%@}".f(key);
        regex = new RegExp(tok, "g");
        value = obj[key];
        str = str.replace(regex, value);
      }
      str = str.replace(token, "");
      return str;
    },

    camelize: function () {
      var str = this.toString().replace(camel, camelizeChar);
      return str.charAt(0).toLowerCase() + str.slice(1);
    },

    decamelize: function () {
      return this.toString().replace(decamel, "$1_$2").toLowerCase();
    },
    
    w: function () {
      return this.toString().split(" ");
    }
  });
}());