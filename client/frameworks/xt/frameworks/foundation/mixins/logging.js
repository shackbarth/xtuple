
/*globals XT */

/** @namespace

*/
XT.Logging = {

  /** @private */
  initMixin: function() {

    // @note This was because SC will connect the bindings
    //  too late for our purposes (since we need to log in
    //  many cases during initialization of an object).
    (this.logLevelsBinding = SC.Binding
      .from("XT.logLevels")
      .to("logLevels", this)
      .oneWay())
      .connect()
      .flushPendingChanges();
  },

  /** @private */
  destroyMixin: function() {
    if(this.logLevelsBinding)
      this.logLevelsBinding.disconnect();
    else this.warn("No logLevelsBinding to destroy");
    delete this.logLevelsBinding;
  },

  /**
    Log for general information.
  */
  log: function(msg) {
    if(this.getPath("logLevels.info") === NO) return;
    return SC.Logger.info("%@: %@".fmt(this.get("logPrefix"), msg));
  },

  /**
    Log for non-fatal warnings.
  */
  warn: function(msg) {
    if(this.getPath("logLevels.warn") === NO) return;
    return SC.Logger.warn("WARN %@: %@".fmt(this.get("logPrefix"), msg));
  },

  /**
    Log for a fatal error when encountered.
  */
  error: function(msg) {
    if(this.getPath("logLevels.error") === NO) return;
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
