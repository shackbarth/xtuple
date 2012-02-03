

xt.sessionStore = xt.object.create(
  /** @lends xt.sessionStore.prototype */ {

  //.......................................
  // Public API
  //

  /**
    Attempts to create a new session for the current
    client request and passed in xt response object. If
    the user is authenticated then a session will be
    generated and the session id will be passed back to
    the client. If the user could not be successfully
    authenticated the request will be closed.

    @param {xt.response} xtr The xt response object.
    @param {Function} [callback] The callback to be executed on success.
  */
  createSession: function(xtr, cb) {

    // take username, password and ip address
    // validate the username and password
    // on success continue else fail


    xt.debug("in xt.sessionStore.createSession");


    var payload = xtr.get('payloadJSON'),
        u = payload.username,
        p = payload.password, q;
    q = "select validate_user('%@', '%@')".f(u, p);
    xt.db.query(q, function(e, r) {
      if(e) return issue(xt.close("Error authenticating user, '%@'".f(u || 'none'), xtr));
      r = r.rows[0]; // only looking for single row response from query
      if(r.validate_user)
        this.loadUser(u, function(e, userkey) {
          if(e) return issue(xt.close("Error loading user account form database", xtr));
          
          // the session will store itself in the cache and will remove
          // the reference to the xt response when it is done initializing
          // to free it
          var session = xt.session.create({ userKey: userkey, xtr: xtr, userName: u });
          
          if(cb && xt.typeOf(cb) === xt.t_function) cb(session, xtr);
        });
      else issue(xt.close("Could not validate user, '%@'".f(u || 'none'), xtr));
    });

  },

  /**
  
    
  
  */
  validateSession: function(xtr, cb) {


    xt.debug("in xt.sessionStore.validateSession");


    // take username, session id and ip address
    // and do a lookup to verify that the session
    // exists and is active
    
    var payload = xtr.get('info.payloadJSON'),
        u = payload.userName,
        s = payload.sid,
        i = xtr.get('info.clientAddress'),
        key = '%@:%@:%@'.f(u, i, s);
    xt.cache.hgetall(key, function(e, r) {
      if(e) return issue(xt.close("Error retrieving session data, %@".f(e), xtr));
      if(xt.none(r) || r.keys().length <= 0)
        return issue(xt.close("Invalid session", xtr));
      var session = xt.session.create({ data: r, xtr: xtr, userName: u, userKey: 'user:%@'.f(u) });
      if(cb && xt.typeOf(cb) === xt.t_function) cb(session, xtr);
    });

  },
  
  /**
  */
  getSession: function(xtr) {
    this.validateSession(xtr);
  },

  //.......................................
  // Private API
  //

  /**
    Attempts to load the user into the cache. If the user
    is already loaded, does nothing but associate the key
    to the session otherwise it must load the user from
    the database into the cache and then associate it with
    the session. The callback is expected to handle error
    cases.

    @param {String} username The username to retrieve.
    @param {Function} callback The callback function to call.
    @param {Object} [context] The context to execute the callback as.
    @method
  */
  loadUser: function(u, f, c) {
    if(xt.none(u)) return;
    if(xt.typeOf(f) !== xt.t_function) return;
    if(xt.none(c)) c = this;
    var cb = function(e, r) { f.call(c, e, r); },
        k = 'user:%@'.f(u);
    xt.cache.hgetall(k, function(e, r) {

      // allow the callback to handle error case
      if(e) return cb(e);
      if(xt.none(r) || r.keys().length == 0) {

        xt.debug("Loading user ('%@') from the database into the cache".f(u));
        
        // user not loaded into the cache so we need to grab
        // it from the database and load it into the store
        var q = "select * from xm.user_account where username='%@'".f(u);
        xt.db.query(q, function(e, r) {

          // allow the callback to handle error case
          if(e) return cb(e);
          r = r.rows[0];

          // if there is nothing the user doesn't exist?
          if(xt.none(r)) return cb(xt.warn("User did not exist ('%@')".f(u)));
          
          // we have valid data for the user and we know exactly
          // what the key will be for them, shove the object into
          // the cache as a hash and then pass the key into the
          // callback for success
          xt.cache.hmset(k, r);
        });
      }

      // all done
      cb(null, k); 
    }); 
  },

  /**
  */
  deleteSession: function() {
  },

  /**
  */
  pollCache: function() {

    // will be set to poll the cache for invalid or
    // expired sessions and remove them

  },

  /** @private */
  className: 'xt.sessionStore'

});
