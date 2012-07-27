/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";
  
  XT.Object = function () {
    this._super = XT.Object.prototype;
    return XT.init.apply(this, arguments[0]);
  };
  
  XT.mixin(XT.Object, {
    
    create: function () {
      var K = this, ret = new K(arguments);
      return ret;
    },
    
    extend: function () {
      var ret = function () { return XT.init.apply(this, arguments[0]); },
          args = XT.$A(arguments), len = args.length, i = 0, proto;
      ret = XT.mixin(ret, this);
      proto = (ret.prototype = XT.sire(this.prototype));
      for (; i < len; ++i) XT.protoExtend(proto, args[i]);
      proto.constructor = ret;
      return ret;
    },
    
    toString: function () {
      var klass = this.className || this.prototype.className;
      return "[ CLASS: %@ ]".f(klass);
    }
  });
  
  XT.Object.prototype = {};
  
  XT.mixin(XT.Object.prototype, {

    init: function () {},

    set: function () {
      return XT.set.apply(this, arguments);
    },

    get: function () {
      return XT.get.apply(this, arguments);
    },

    className: "XT.Object",

    _events: null,
  
    addEvent: function (event, listener) {
      //XT.log("addEvent(): %@ => %@".f(this.uid, event));
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
      var args = XT.$A(arguments);
      args.unshift(this);
      XT.mixin.apply(this, args);
    },
  
    _XT_OBJECT: true
  });
  
  XT.mixin(XT.Object.prototype, require("events").EventEmitter.prototype);
}());