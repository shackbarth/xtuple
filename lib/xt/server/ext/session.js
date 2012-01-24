
/** @class
  Session objects are nothing more than context containers. They
  are created once a client requests a session and is validated
  as a current/active user. Active sessions enable the queries
  to be executed as the correct database user (for privilege
  enforcement), tracking and additional automated events that
  use the current user (triggers).

  <p></p>

  Sessions are fairly dumb objects that are acted on by the
  session store. They have a limited API and automatically
  generate query prefixes for the user assigned to them while
  also supplying a special callback during queries. Queries
  are executed under the context of the session to which they
  belong and this gives access to the xt response object
  supplied during client requests and allows for the callback
  to write to the correct client.

  <p></p>

  **WARNING**

  <p></p>

  In this pass (as of 01/24/2012) sessions are very unsecure.
  An effort will be made to clean up this process but as such
  they are volatile and the API is expected to change
  dramatically in the future.

  @example
    
    // this is unrealistic because sessions are created
    // automatically on client requests not manually but
    // for the sake of example...
    var s = xt.session.create({ 
      info: { user: 'cole', ip: '127.0.0.1' }
    });

    // note that the query will be prefixed properly
    // automatically to ensure it is executed in the correct
    // context of the appropriate user
    // also note that error handling is already dealt with
    // by the session object so the callback will only
    // be executed when errors do not exist
    s.query('select * from public.incdt', function(r) {

      // inside the callback we are in the context of the
      // session and can request the xt response object (xtr)
      var xtr = this.get('xtr');
      
      // write some response from the successfully executed
      // query directly back to the client as the payload
      // of the response and close the response object
      xtr.write(xt.json(r)).close();
    });
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

    var s = this,
        f = function(e, r) {
          if(e)
            issue(xt.close("Error during session query, %@".f(e), s.get('xtr')));
          else func.apply(s, r);
          s.set('xtr', null);  
        };

    // ...
    xt.db.query(query, f);
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
