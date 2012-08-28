/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  /**
    Base object for node layer

    @class
    @constructor
   */
  X.Object = function () {
    this._super = X.Object.prototype;
    return X.init.apply(this, arguments[0]);
  };

  X.mixin(X.Object, /** @lends X.Object */{

    /**
      Creates an instance of the object.

     */
    create: function () {
      var K = this, ret = new K(arguments);
      return ret;
    },

    /**
      Creates a constructor that represents a sublass of X.Object

     */
    extend: function () {
      var ret = function () { X.init.apply(this, arguments[0]); },
          args = X.$A(arguments), len = args.length, i = 0, proto;
      ret = X.mixin(ret, this);
      proto = (ret.prototype = X.sire(this.prototype));
      for (; i < len; ++i) X.protoExtend(proto, args[i]);
      proto.constructor = ret;
      return ret;
    },

    /**
      Prints to string

     */
    toString: function () {
      var klass = this.className || this.prototype.className;
      return "[ CLASS: %@ ]".f(klass);
    }
  });

  X.Object.prototype = {};

  X.mixin(X.Object.prototype, /** @lends X.Object.prototype */{

    init: function () {},

    set: function () {
      return X.set.apply(this, arguments);
    },

    get: function () {
      return X.get.apply(this, arguments);
    },

    className: "X.Object",

    _events: null,

    addEvent: function (event, listener) {
      //X.log("addEvent(): %@ => %@".f(this.uid, event));
      // TODO: revert to custom event handling system
      // as opposed to native here
      this.addListener(event, listener);
    },

    removeEvent: function (event) {
      this.removeAllListeners(event);
    },

    toString: function () {
      var klass = this.className || "NOCLASS",
          uid = this.uid || "NOUID";
      return "[ %@ (%@) ]".f(klass, uid);
    },

    /**
      Applies the properties of the passed object to the base.

      @param {Object} mixins
     */
    mixin: function () {
      var args = X.$A(arguments);
      args.unshift(this);
      X.mixin.apply(this, args);
    },

    _X_OBJECT: true
  });

  X.mixin(X.Object.prototype, require("events").EventEmitter.prototype);
}());
