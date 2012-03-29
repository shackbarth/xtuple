/*globals XT */

/** @mixin */
XT.Logging = {

  /**
    Log for general information.
  */
  log: function(msg) {
    var args = Array.prototype.slice.call(arguments).slice(1);
    if(XT.getPath("logLevels.info") === NO || 
      this.get('logLocal') === NO) return;
    SC.Logger.info("%@: %@".fmt(this.get("logPrefix"), msg));
    if(args.length > 0)
      args.forEach(function(arg) { console.log(arg); });
    return;
  },

  /**
    Log for non-fatal warnings.
  */
  warn: function(msg) {
    if(XT.getPath("logLevels.warn") === NO) return;
    return SC.Logger.warn("WARN %@: %@".fmt(this.get("logPrefix"), msg));
  },

  /**
    Log for a fatal error when encountered.
  */
  error: function(msg) {
    if(XT.getPath("logLevels.error") === NO) return;
    msg = "ERROR %@: %@".fmt(this.get("logPrefix"), msg);
    if(arguments.length > 1 && arguments[1] === YES)
      throw msg;
    else return SC.Logger.error(msg);
  },

  /** @property */
  logPrefix: function() {
    var cn = SC._object_className(this.constructor),
        name = this.get("name"),
        prefix;
    if(SC.empty(name)) prefix = "%@<%@>".fmt(cn, SC.guidFor(this));
    else prefix = "%@<%@, %@>".fmt(cn, name, SC.guidFor(this));
    return prefix;
  }.property().cacheable()

} ;
