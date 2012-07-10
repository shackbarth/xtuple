/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  XT.proto = {};
  
  require("./string");
  require("./function");
  
  XT.mixin(Array.prototype, {
    contains: function (needle) {
      return (this.indexOf(needle) > -1);
    }
  });
  
  XT.mixin(Function.prototype, {
    property: function () {
      return XT.Function.property(this);
    },

    observes: function () {
      var args = XT.$A(arguments), len = args.length, i = 0;
      for (; i < len; ++i) XT.Function.observes(this, args[i]);
      return this;
    }
  });
  
  XT.mixin(String.prototype, {
    format: function () {
      return XT.String.format.apply(this, arguments);
    },

    f: function () {
      return XT.String.format.apply(this, arguments);
    },

    w: function () {
      return XT.String.w.apply(this, arguments);
    },

    capitalize: function () {
      return XT.String.capitalize.apply(this, arguments);
    },

    cap: function () {
      return XT.String.capitalize.apply(this, arguments);
    },

    h: function () {
      return this.c().cap();
    },

    trim: function () {
      return XT.String.trim.apply(this, arguments);
    },

    pre: function () {
      return XT.String.pre.apply(this, arguments);
    },

    suf: function () {
      return XT.String.suf.apply(this, arguments);
    },

    camelize: function () {
      return XT.String.camelize.apply(this, arguments);
    },

    c: function () {
      return XT.String.camelize.apply(this, arguments);
    },
 
    decamelize: function () {
      return XT.String.decamelize.apply(this, arguments);
    },

    d: function () {
      return XT.String.decamelize.apply(this, arguments);
    }
  });
}());