/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _ = X._;

  X.colors = require("colors");

  require("./ext/string_buffer");

  X.io = X.Object.create({

    out: function () {
      return this.stdout;
    },

    buff: function () {
      return X.StringBuffer.create();
    },

    timestamp: function () {
      return (new Date()).toISOString();
    },

    log: function () {
      var args = X.$A(arguments), buff = this.buff(), flushed;
      buff.set("color", "grey");
      buff.set("prefix", "<<LOG %@>>".f(this.timestamp()));
      args.unshift(buff);
      flushed = this.console.apply(this, args);
      this.hook("log", flushed);
    },

    warn: function () {
      var args = X.$A(arguments), buff = this.buff(), flushed;
      buff.set("color", "yellow");
      buff.set("prefix", "<<WARN %@>>".f(this.timestamp()));
      args.unshift(buff);
      flushed = this.console.apply(this, args);
      this.hook("warn", flushed);
    },

    err: function () {
      var args = X.$A(arguments), buff = this.buff(), flushed;
      buff.set("color", "red");
      buff.set("prefix", "<<ERROR %@>>".f(this.timestamp()));
      args.unshift(buff);
      flushed = this.console.apply(this, args);
      this.hook("err", flushed);
    },

    // note: this doesn't get used for websocket debugging in node-datasource
    debug: function () {
      var args, buff, flushed;
      if (!X.options.datasource.debugging) return;
      args = X.$A(arguments);
      buff = this.buff();
      buff.set("color", "blue");
      buff.set("prefix", "<<DEBUG %@>>".f(this.timestamp()));
      args.unshift(buff);
      flushed = this.console.apply(this, args);
      this.hook("debug", flushed);
    },

    addHook: function (targets, hook) {
      var hooks = this.hooks || (this.hooks = {}), target, i = 0;
      if (X.none(hook) || X.typeOf(hook) !== X.T_FUNCTION) return;
      if (X.typeOf(targets) !== X.T_ARRAY) targets = [targets];
      for (; i < targets.length; ++i) {
        target = targets[i];
        if (hooks[target]) hooks[target].push(hook);
      }
    },

    hook: function (which, content) {
      var hooks = this.hooks[which], i;
      if (X.none(hooks)) return;
      i = hooks.length;
      while (--i > 0) hooks[i](content);
    },

    console: function () {
      var args = X.$A(arguments), buff = args.shift(),
          i = 0, out = this.out(), flushed;
      args = this.inspectArray.apply(this, args);
      for (; i < args.length; ++i) buff.push(args[i]);
      flushed = buff.flush();
      out.write(flushed.color + "\n");
      return flushed;
    },

    inspectArray: function () {
      var args = X.$A(arguments), i = 0;
      for (; i < args.length; ++i)
        if (X.typeOf(args[i]) !== X.T_STRING)
          args[i] = X.util.inspect(args[i]).trim();
      return args;
    },

    hooks: {
      log: [],
      warn: [],
      debug: [],
      err: []
    },

    stdout: process.stdout,

    className: "X.io"
  });

  X.log      = _.bind(X.io.log, X.io);
  X.debug    = _.bind(X.io.debug, X.io);
  X.err      = _.bind(X.io.err, X.io);
  X.warn     = _.bind(X.io.warn, X.io);
}());
