
/*globals XT, process */

XT.colors = require('colors');

require('./ext/string_buffer');

/** @namespace
  
  Methods for input, output, logging, debugging (etc) and file logging
  are accessible from the XT.io namespace. Management of hooks are
  available from this namespace as well as file logging properties.
  
  Notes
  
  The hooks implementation is weak and could be extended to
  handle much more effient registration as well as to not
  require a scoped function.
*/
XT.io = {};

XT.mixin(XT.io,
  /** @scope XT.io */ {

  out: function() {
    return XT.io._xt_out;
  },
  
  buff: function() {
    return XT.StringBuffer.create();
  },
  
  log: function() {
    var args = Array.prototype.slice.call(arguments);
    var buff = XT.io.buff();
    var flushed;
    
    // set the color and prefix of the buffer
    buff.set('color', 'grey')
        .set('prefix', '<<LOG>>');
        
    // add the buffer to the front of the arguments array
    args.unshift(buff);
    
    // process the output and retrieve the flushed content
    flushed = XT.io.__console__.apply(this, args);
    
    // now allow any hooks to handle the content
    XT.io.hook('log', flushed);
  },
  
  warn: function() {
    var args = Array.prototype.slice.call(arguments);
    var buff = XT.io.buff();
    var flushed;
    
    // set the color and prefix of the buffer
    buff.set('color', 'yellow')
        .set('prefix', '<<WARN>>');
        
    // add the buffer to the front of the arguments array
    args.unshift(buff);
    
    // process the output and retrieve the flushed content
    flushed = XT.io.__console__.apply(this, args);
    
    // now allow any hooks to handle the content
    XT.io.hook('warn', flushed);
  },
  
  err: function() {
    var args = Array.prototype.slice.call(arguments);
    var buff = XT.io.buff();
    var flushed;
    
    // set the color and prefix of the buffer
    buff.set('color', 'red')
        .set('prefix', '<<ERROR>>');
        
    // add the buffer to the front of the arguments array
    args.unshift(buff);
    
    // process the output and retrieve the flushed content
    flushed = XT.io.__console__.apply(this, args);
    
    // now allow any hooks to handle the content
    XT.io.hook('err', flushed);
  },
  
  debug: function() {
    
    // if debugging is off do nothing
    if (!XT.debugging) return;
    
    var args = Array.prototype.slice.call(arguments);
    var buff = XT.io.buff();
    var flushed;
    
    // set the color and prefix of the buffer
    buff.set('color', 'blue')
        .set('prefix', '<<DEBUG>>');
        
    // add the buffer to the front of the arguments array
    args.unshift(buff);
    
    // process the output and retrieve the flushed content
    flushed = XT.io.__console__.apply(this, args);
    
    // now allow any hooks to handle the content
    XT.io.hook('debug', flushed);
  },
  
  report: function() {
    var args = Array.prototype.slice.call(arguments);
    var buff = XT.io.buff();
    var ret = [];
    var title = args[1] || "reported content";
    var desc = args[2] || "auto-generated report";
    var flushed;
    var idx = 0;
    var key;
    var bottom = "---";
    
    // grab the kv pairs of data to report
    args = args[0];
    
    // setup the buffer so it doesn't have a prefix
    // and adjust color
    // TODO: why is this color fixed? 
    buff.set('color', 'magenta')
        .set('prefix', null);
    
    // for aesthetics produce the correct number of bars
    for (; idx < title.length; ++idx) {
      bottom += '-';
    }
    bottom += '\n';
    idx = 0;
    
    // loop through the properties to be reported and
    // push them to the buffer
    for (key in args) {
      if (args.hasOwnProperty(key)) {
        if (XT.none(args[key])) continue;
        ret.push("  {key}: {value}\n".f({ key: key, value: args[key] }));
      }
    }
    
    // add the description and title to the report content
    ret.unshift("{desc}\n".f({ desc: desc }));
    ret.unshift("\n-- {title}\n".f({ title: title }));
    
    // the console expects the first parameter to be a buffer
    // so shove our buffer to the front
    ret.unshift(buff);
    
    // throw our measured bars to the end
    ret.push(bottom);
    
    // we want to grab the flushed content (formatted) so
    // if there are any hooks for the content we can
    // supply it
    flushed = XT.io.__console__.apply(this, ret);
    
    // go ahead and push the flushed content to the hooks
    // handler
    XT.io.hook('report', flushed);
  },
  
  
  addHook: function(targets, hook) {
    if (XT.none(hook) || !(hook instanceof Function)) return;
    
    var hooks = XT.io._xt_hooks;
    var idx = 0;
    var target;
    
    // if targets isn't an array convert it to
    // one for single path 
    if (XT.typeOf(targets) !== XT.T_ARRAY) {
      targets = [targets];
    }
    
    // iterate over the targets and register the
    // hook accordingly
    for (; idx < targets.length; ++idx) {
      target = targets[idx];
      if (hooks[target]) {
        hooks[target].push(hook);
      }
    }
  },
  
  hook: function(which, content) {
    // TODO: can/should this be cached
    if (XT.none(which) || !(which in XT.io._xt_hooks)) return;
    var hooks = XT.io._xt_hooks[which];
    var hook;
    var idx = 0;
    
    // loop through the hooks (if any) and pass them
    // the content
    for (; idx < hooks.length; ++idx) {
      hook = hooks[idx];
      if (hook instanceof Function) {
        hook(content);
      }
    }
  },
  
  __console__: function() {
    
    // if no string buffer or content are available
    // there is nothing to do
    if (arguments.length < 2) return;
    
    var args = Array.prototype.slice.call(arguments);
    var buff = args.shift();
    var idx = 0;
    var out = XT.io.out();
    var flushed;
    
    // handle inspection of objects for printable form
    args = XT.io.inspectArray.apply(this, args);
    
    // iterate over the arguments and add them to the
    // buffer
    for (; idx < args.length; ++idx) {
      buff.push(args[idx]);
    }
    
    // flush the buffer
    flushed = buff.flush();
    
    // dump the color-formatted string version
    // to the console
    out.write(flushed.color + '\n');
    
    // return the flushed buffer object
    return flushed;
  },
  
  inspectArray: function() {
    var args = Array.prototype.slice.call(arguments);
    var idx = 0;
    var arg;
    
    // iterate over the arguments and inspect them to prepare
    // them for human-readable output
    for (; idx < args.length; ++idx) {
      arg = args[idx];
      if (XT.typeOf(arg) !== XT.T_STRING) {
        arg = XT.util.inspect(arg).trim();
        args[idx] = arg;
      }
    }
    
    // return the inspected array
    return args;
  },
  
  /** @private */
  _xt_hooks: {
    log: [],
    warn: [],
    debug: [],
    err: [],
    report: []
  },
  
  /** @private */
  _xt_out: process.stdout
    
});

/** @methodOf XT */
XT.log      = XT.io.log;

/** @methodOf XT */
XT.debug    = XT.io.debug;

/** @methodOf XT */
XT.err      = XT.io.err;

/** @methodOf XT */
XT.report   = XT.io.report;

/** @methodOf XT */
XT.warn     = XT.io.warn;