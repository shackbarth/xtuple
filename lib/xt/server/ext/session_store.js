

/** @class
  The session store houses the accessor methods
  for creating, validating and managing sessions.
  Nearly all requests from the client require an
  authenticated user with an active session to execute
  their requests. 
*/
XT.sessionStore = XT.Object.create(
  /** @lends XT.sessionStore.prototype */ {

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

    @param {XT.Response} xtr The xt response object.
    @param {Function} [callback] The callback to be executed on success.
  */
  createSession: function(xtr, cb) {

    // take username, password and ip address
    // validate the username and password
    // on success continue else fail


   //  XT.debug("in XT.sessionStore.createSession");


    var payload = xtr.get('payloadJSON'),
        u = payload.userName,
        p = payload.password,
        self = this, q;
    q = "select validate_user('%@', '%@')".f(u, p);
    XT.db.query(q, function(e, r) {
      if(e) return issue(XT.close("Error authenticating user, '%@'".f(u || 'none'), xtr));
      r = r.rows[0]; // only looking for single row response from query
      if(r.validate_user)
        self.loadUser(u, function(e, userkey) {
          if(e) return issue(XT.close("Error loading user account form database", xtr));
          
          // the session will store itself in the cache and will remove
          // the reference to the xt response when it is done initializing
          // to free it
          var session = XT.Session.create({ userKey: userkey, xtr: xtr, userName: u });
          
          if(cb && XT.typeOf(cb) === XT.T_FUNCTION) session.once('xtReady', function() { cb(session, xtr); });
        });
      else issue(XT.close("Could not validate user, '%@'".f(u || 'none'), xtr));
    });

  },

  /**
    For data requests that require an authenticated user with
    an active session, each request will pass through this
    method. It attempts to validate the user and the session
    and if successful will allow the request to continue otherwise
    it will close the request with an error to the client.
    
    @param {XT.Response} response The xt response object generated
      from the request.
    @param {Function} [callback] The callback function to be executed
      on succcessful completion of the session validation.
    @method
  */
  validateSession: function(xtr, cb) {


  //  XT.debug("in XT.sessionStore.validateSession");

    // take username, session id and ip address
    // and do a lookup to verify that the session
    // exists and is active
    
    var payload = xtr.get('payloadJSON'),
        u = payload.userName,
        s = payload.sid,
        i = xtr.get('info.clientAddress'),
        key = '%@:%@:%@'.f(u, i, s);
        
    // XT.debug("asking cache for %@".f(key));  
      
    XT.cache.hgetall(key, function(e, r) {
      if(e) return issue(XT.close("Error retrieving session data, %@".f(e), xtr));
      // if(XT.none(r) || r.keys().length <= 0)
      if(XT.none(r) || XT.keys(r).length <= 0)
        return issue(XT.close("Invalid session", xtr));
        
      var session = XT.Session.create({ data: r, xtr: xtr, userName: u, userKey: 'user:%@'.f(u), sid: s });
      if(cb && XT.typeOf(cb) === XT.T_FUNCTION) session.once('xtReady', function() { cb(session, xtr); });
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
    @param {Boolean} [force] Whether or not to force a reload from
      the database for user data.
    @method
  */
  loadUser: function(u, f, c, force) {
    if(XT.none(u)) return;
    if(XT.typeOf(f) !== XT.T_FUNCTION) return;
    if(XT.none(c)) c = this;
    var cb = function(e, r) { f.call(c, e, r); },
        k = 'user:%@'.f(u);
    XT.cache.hgetall(k, function(e, r) {

      // allow the callback to handle error case
      if(e && !force) return cb(e);
      if(XT.none(r) || XT.keys(r).length == 0 || force) {

        XT.debug("Loading user ('%@') from the database into the cache".f(u));
        
        // user not loaded into the cache so we need to grab
        // it from the database and load it into the store
        var q = "select * from xm.user_account where username='%@'".f(u);
        XT.db.query(q, function(e, r) {

          // allow the callback to handle error case
          if(e) return cb(e);
          r = r.rows[0];

          // if there is nothing the user doesn't exist?
          if(XT.none(r)) return cb(XT.warn("User did not exist ('%@')".f(u)));
          
          // we have valid data for the user and we know exactly
          // what the key will be for them, shove the object into
          // the cache as a hash and then pass the key into the
          // callback for success
          XT.cache.hmset(k, r);
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
    Automatically set to run at fixed intervals this asynchronous
    polling method checks for sessions in the cache and determines
    if they are expired based on server configuration. If the session
    is expired it will be removed from the cache thus forcing any
    client attempting to use the session to reauthenticate. This
    method does not need to be called directly and is managed by
    the server configuration options.
    
    @method
  */
  pollCache: function() {

    // will be set to poll the cache for invalid or
    // expired sessions and remove them
    
    // XT.log("Polling cache for expired sessions");
    
    var now = XT.Session.timestamp(),
        timeout = XT.sessionStore.sessionTimeout;
    
    // first find all of the users that may have sessions and
    // that are just sitting in the cache
    XT.cache.keys('user:*', function(e, loadedUsers) {
      if(e) return issue(XT.warn("Could not poll cache for active users"));
      var i = 0,
          l = loadedUsers.length;
      for(; i<l; ++i) {
        var user = loadedUsers[i].split(':')[1];
        
        // next we need to iterate over them and find any
        // sessions the cache may have for each user
        XT.cache.keys('%@:*'.f(user), function(e, sessionsFor) {
          if(e) return issue(XT.warn("Could not poll cache for active sessions"));
          var i = 0,
              l = sessionsFor.length;
          for(; i<l; ++i) {
            var sessionKey = sessionsFor[i];
            
            // now grab the session data and see if the session is
            // old enough to remove
            XT.cache.hgetall(sessionKey, function(e, data) {
              if(e) return issue(XT.warn("Could not retrieve session data for entry while polling"));
              var dif = Math.abs(now - data.lastModified);
              if(dif > timeout) {
                // XT.log("Removing expired session for user '%@' (%@ : %@)".f(data.userName, data.sid, data.ip));
                var key = '%@:%@:%@'.f(data.userName, data.ip, data.sid);
                XT.cache.del(key);
              }
              else {
                var timeleft = Math.round(((Math.abs(timeout-dif)/1000)/60)*100)/100;
                // XT.log("%@ : %@ => %@ minutes left".f(data.userName, data.sid, timeleft));
              }
            });
          }
        });
      }
    });
  },

  /** @private */
  init: function() {
    
    // set an interval for polling the cache for these expired sessions
    this.__pollingTimer__ = setInterval(this.pollCache, 60000 /* 1 minute */);
  },

  /** @private */
  className: 'XT.sessionStore'

});

process.once('xtBootstrapped', function() {
  
  // grab the session-timeout from the configuration and calculate
  // that for the appropriate number of milliseconds
  XT.sessionStore.sessionTimeout = XT.opts.t ? XT.opts.t * 60000 : 900000; // default to 15 minutes
  
  // share this information with the world...  
  XT.log("Session timeout has been set to %@ minutes (%@ milliseconds)".f(XT.opts.t, XT.sessionStore.sessionTimeout));
  
  // go ahead and poll it from the start to clear out any invalid
  // sessions since the node server is just starting up
  process.once('xtCacheAvailable', XT.sessionStore.pollCache);
});
