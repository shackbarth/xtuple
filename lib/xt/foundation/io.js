/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";
  
  var _ = XT._;
  
  XT.colors = require("colors");
  
  require("./ext/string_buffer");

  XT.io = XT.Object.create({
  
    out: function () {
      return this.stdout;
    },
    
    buff: function () {
      return XT.StringBuffer.create();
    },
    
    log: function () {
      var args = XT.$A(arguments), buff = this.buff(), flushed;
      buff.set("color", "grey");
      buff.set("prefix", "<<LOG>>");
      args.unshift(buff);
      flushed = this.console.apply(this, args);
      this.hook("log", flushed);
    },
    
    warn: function () {
      var args = XT.$A(arguments), buff = this.buff(), flushed;
      buff.set("color", "yellow");
      buff.set("prefix", "<<WARN>>");
      args.unshift(buff);
      flushed = this.console.apply(this, args);
      this.hook("warn", flushed);
    },
    
    err: function () {
      var args = XT.$A(arguments), buff = this.buff(), flushed;
      buff.set("color", "red");
      buff.set("prefix", "<<ERROR>>");
      args.unshift(buff);
      flushed = this.console.apply(this, args);
      this.hook("err", flushed);
    },
    
    debug: function () {
      var args, buff, flushed;
      if (!XT.debugging) return;
      args = XT.$A(arguments);
      buff = this.buff();
      buff.set("color", "blue");
      buff.set("prefix", "<<DEBUG>>");
      args.unshift(buff);
      flushed = this.console.apply(this, args);
      this.hook("debug", flushed);
    },
    
    addHook: function (targets, hook) {
      var hooks = this.hooks || (this.hooks = {}), target, i = 0;
      if (XT.none(hook) || XT.typeOf(hook) !== XT.T_FUNCTION) return;
      if (XT.typeOf(targets) !== XT.T_ARRAY) targets = [targets];
      for (; i < targets.length; ++i) {
        target = targets[i];
        if (hooks[target]) hooks[target].push(hook);
      }
    },
    
    hook: function (which, content) {
      var hooks = this.hooks[which], i;
      if (XT.none(hooks)) return;
      i = hooks.length;
      while (--i > 0) hooks[i](content);
    },
    
    console: function () {
      var args = XT.$A(arguments), buff = args.shift(),
          i = 0, out = this.out(), flushed;
      args = this.inspectArray.apply(this, args);
      for (; i < args.length; ++i) buff.push(args[i]);
      flushed = buff.flush();
      out.write(flushed.color + "\n");
      return flushed;
    },
    
    inspectArray: function () {
      var args = XT.$A(arguments), i = 0;
      for (; i < args.length; ++i)
        if (XT.typeOf(args[i]) !== XT.T_STRING)
          args[i] = XT.util.inspect(args[i]).trim();
      return args;
    },
    
    hooks: {
      log: [],
      warn: [],
      debug: [],
      err: []
    },
    
    stdout: process.stdout,
    
    className: "XT.io"
  });
  
  XT.log      = _.bind(XT.io.log, XT.io);
  XT.debug    = _.bind(XT.io.debug, XT.io);
  XT.err      = _.bind(XT.io.err, XT.io);
  XT.warn     = _.bind(XT.io.warn, XT.io);
}());