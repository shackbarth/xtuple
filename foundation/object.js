/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";
  
  X.Object = function () {
    this._super = X.Object.prototype;
    return X.init.apply(this, arguments[0]);
  };
  
  X.mixin(X.Object, {
    
    create: function () {
      var K = this, ret = new K(arguments);
      return ret;
    },
    
    extend: function () {
      var ret = function () { X.init.apply(this, arguments[0]); },
          args = X.$A(arguments), len = args.length, i = 0, proto;
      ret = X.mixin(ret, this);
      proto = (ret.prototype = X.sire(this.prototype));
      for (; i < len; ++i) X.protoExtend(proto, args[i]);
      proto.constructor = ret;
      return ret;
    },
    
    toString: function () {
      var klass = this.className || this.prototype.className;
      return "[ CLASS: %@ ]".f(klass);
    }
  });
  
  X.Object.prototype = {};
  
  X.mixin(X.Object.prototype, {

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
    
    mixin: function () {
      var args = X.$A(arguments);
      args.unshift(this);
      X.mixin.apply(this, args);
    },
  
    _X_OBJECT: true
  });
  
  X.mixin(X.Object.prototype, require("events").EventEmitter.prototype);
}());
