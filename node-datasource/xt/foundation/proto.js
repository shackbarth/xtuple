/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  X.proto = {};

  require("./string");
  require("./function");

  X.mixin(Array.prototype, {
    contains: function (needle) {
      return (this.indexOf(needle) > -1);
    }
  });

  X.mixin(Function.prototype, {
    property: function () {
      return X.Function.property(this);
    },

    observes: function () {
      var args = X.$A(arguments), len = args.length, i = 0;
      for (; i < len; ++i) X.Function.observes(this, args[i]);
      return this;
    }
  });

  X.mixin(String.prototype, {
    format: function () {
      return X.String.format.apply(this, arguments);
    },

    f: function () {
      return X.String.format.apply(this, arguments);
    },

    w: function () {
      return X.String.w.apply(this, arguments);
    },

    capitalize: function () {
      return X.String.capitalize.apply(this, arguments);
    },

    cap: function () {
      return X.String.capitalize.apply(this, arguments);
    },

    h: function () {
      return this.c().cap();
    },

    trim: function () {
      return X.String.trim.apply(this, arguments);
    },

    pre: function () {
      return X.String.pre.apply(this, arguments);
    },

    suf: function () {
      return X.String.suf.apply(this, arguments);
    },

    camelize: function () {
      return X.String.camelize.apply(this, arguments);
    },

    c: function () {
      return X.String.camelize.apply(this, arguments);
    },

    camelToHyphen: function () {
      return X.String.camelToHyphen.apply(this, arguments);
    },

    decamelize: function () {
      return X.String.decamelize.apply(this, arguments);
    },

    d: function () {
      return X.String.decamelize.apply(this, arguments);
    },

    escape: function () {
      return X.String.escape.call(this);
    }
  });
}());
