
/** @class
*/
xt.session = xt.object.extend(
  /** @lends xt.session.prototype */ {

  /**
    Allows queries to be run correctly according to their
    active session information. If the callback function
    is not provided the open server response object will
    automatically be closed with no bytes written to the
    client. The callback will be executed within the context
    of the session object and allows the use of this inside
    to retrieve the xt response object or other properties.

    @param {String} query The query string to execute under the session.
    @param {xt.response} xtr The xt response object.
    @param {Function} [func] The callback for completed queries.
    @method
  */
  query: function(query, xtr, func) {
    if(!this.get('isActive')) return issue(xt.close(
      "Could not execute query, invalid or inactive session", this.get('xtr')));
    this.set('xtr', xtr);
    query = query.pre(this._xt_userprefix);
    if(xt.none(func) || xt.typeOf(func) !== xt.t_func)
      func = xt.session._xt_default_callback;

    var s = this;

    // will allow for additional cleanup later...
    func = function() {
      func.apply(s, arguments);
      s.set('xtr', null);  
    };

    // ...
    xt.db.query(query, func);
  }, 

  /**
    Returns whether or not the current session is still active.

    @returns {Boolean} YES|NO on session active status.
  */
  isActive: function() {
    return xt.sessionStore.validate(this);
  }.property(),

  /**
    Initializes the xt session object with the
    data passed to it at creation.

    @private
  */
  init: function() {
    var n = this.get('info'),
        u = n.user,
        i = n.ip,
        t = xt.session.time(),
        p = xt.session._xt_seteffectiveuser;
    this.set('user', u);
    this.set('ip', i);
    this.set('started', t);
    this.set('lastUsed', t);
    this._xt_userprefix = p.f({ user: u });
  },

  /** @private */
  className: 'xt.session'

});

xt.mixin(xt.session,
  /** @lends xt.session */ {

  /**
    The default template query string to be prepended to
    additional queries under this session.
    
    @property
    @private
  */
  _xt_seteffectiveuser: "select seteffectiveuser('{user}'); ",

  /**
    Returns the current UTC time.

    @returns {Integer} The UTC current time in milliseconds.
  */
  time: function() {

    // this seems quite wasteful...
    return new Date().UTC();
  },

  /**
    Returns a unique hash for a particular session.

    @returns {String} The hash for the session.
    @method
  */
  hash: function() {
    return xt.crypto
      .createHash('md5')
      .update(Math.random().toString())
      .digest('hex');
  },

  /**
    The default callback for queries where a callback is not
    supplied. Simply closes the xt response to the client.

    @method
  */
  _xt_default_callback: function(e, r) {
    if(e) return issue(
      xt.close("Error during query, %@".f(xt.inspect(e)), this.get('xtr')));
    r.close();
  }

});
