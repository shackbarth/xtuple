

XT.SessionError = SessionError;

XT.SESSION_MULTIPLE = 0x01;
XT.SESSION_ERROR    = 0x02;
XT.SESSION_VALID    = 0x04;

XT.Session = XT.Object.extend(
  /** @lends XT.Session.prototype */ {

  isReady: false,

  from: function(credentials) {

    var self = this;
    var sid = credentials.sid;
    var organization = credentials.organization;
    var username = credentials.username;
    var password = credentials.password;
    var created = credentials.created;
    var lastModified = credentials.lastModified;
    var checksum = credentials.checksum;

    this.username = username;
    this.organization = organization;
    this.sid = sid;
    this.created = created;
    this.lastModified = lastModified;
    this.checksum = checksum;
    
    if (username && organization && sid) {
      this.set('error', new SessionError(null, "don't support that yet"));
      this.set('isReady', true);
    } else if (username && organization && password) {
      this.authenticate(username, password, organization); 
    } else {
      this.set('error', new SessionError(null, "missing credentials for session request"));
      this.set('isReady', true);
    }

    return this;
  },

  state: XT.SESSION_VALID,

  ready: function(action) {
    var ready = this.get('isReady');
    var queue = this._xt_readyQueue;
    if (ready) return action(this);
    if (!queue) queue = this._xt_readyQueue = [];
    queue.push(action); 
  },

  run: function() {
    var ready = this.get('isReady');
    var queue = this._xt_readyQueue || [];
    var action;
    if (!ready) return;
    while (queue.length > 0) {
      action = queue.shift();
      action(this);
    }
  },

  isReadyDidChange: function() {
    var ready = this.get('isReady');
    if (ready) this.run();
  }.observes('isReady'),

  errorDidChange: function() {
    this.set('state', XT.SESSION_ERROR);
  }.observes('error'),

  authenticate: function(username, password, organization) {
    var query = "select validate_user('%@','%@')".f(username, password);
    var callback = this.didAuthenticate;
    var self = this;
    XT.database.query(organization, query, function() {
      callback.apply(self, arguments);
    });
  },

  didAuthenticate: function(err, ret) {
    var self = this;
    var callback = this.evaluateSessions;
    if (err) {
      this.set('error', new SessionError(null, err.message, err.stack));
    } else {
      if (ret.rows[0].validate_user) {
        this.getActiveSessionsForUser(this.username, function() {
          callback.apply(self, arguments);
        });
      } else {
        this.set('error', new SessionError(null, "could not authenticate user"));
      }
    }
    this.set('isReady', true);
  },

  evaluateSessions: function(err, sessions) {

    XT.debug("evaluateSessions()", sessions);

    var self = this;
    if (err) {
      this.set('error', new SessionError(null, err.message, err.stack));
      this.set('isReady', true);
    } else if (!sessions || sessions.length <= 0) {
      XT.Session.initSession(this);

      XT.debug(this);

      this.commit(function() { self.set('isReady', true); });
    }
  },

  commit: function(callback) {

    XT.debug("COMMIT");

    var self = this;
    var clientAttributes = {
      created: this.created,
      lastModified: XT.Session.timestamp(),
      checksum: null,
      sid: this.sid,
      username: this.username,
      organization: this.organization
    };
    var key = "%@:%@:%@".f(this.username, this.sid, this.organization);
    clientAttributes.checksum = XT.Session.checksum(clientAttributes);

    XT.debug(clientAttributes);

    XT.cache.hmset(key, clientAttributes, function(err, ret) {
      if (callback && callback instanceof Function) {
        callback(err, ret);
      }
    });
  },

 /**
 */
 getActiveSessionsForUser: function(userName, callback) {
   
   var self = this;

   XT.cache.keys("%@:*".f(userName), function(err, sessions) {
     if (err) return callback(err);
     if (sessions.length <= 0) return callback(null, []);  

     var idx = 0;
     var activeSessions = []; 
     process.addListener('%@:ACTIVE_SESSION_SEARCH'.f(userName), function(isActive, sessionKey, sessionData) {
       idx++;
       if (isActive) activeSessions.push({ sessionKey: sessionKey, sessionData: sessionData });
       if (idx === sessions.length) {
         process.removeAllListeners('%@:ACTIVE_SESSION_SEARCH'.f(userName));
         callback(null, activeSessions);
       }
     });

     sessions.forEach(function(sessionKey) {
       XT.cache.hgetall(sessionKey, function(err, sessionData) {
         if (err || !XT.Session.isActiveSession(sessionData)) {
           process.emit('%@:ACTIVE_SESSION_SEARCH'.f(userName), false);
         } else {
           process.emit('%@:ACTIVE_SESSION_SEARCH'.f(userName), true, sessionKey, sessionData); 
         }
       });
     });

   });
 },


});

function SessionError(code, reason, context) {
  this.code = code;
  this.reason = reason;
  this.context = context;
}

XT.mixin(XT.SessionError.prototype,
  /** @lends XT.SessionError.prototype */ {

  json: function() {
    var error = {
      code: this.code,
      reason: this.reason,
      context: this.context
    };
    return XT.json(error);
  },

  isError: true

});


//.............................................
// Post-Initialization Routines
//
XT.mixin(XT.Session, 
  /** @lends XT.Session */ {
  
  /**
    Creates a checksum of the parameter.
    
    @param {Object|String} data The data to be digested into a checksum.
    @returns {String} The checksum of the data.
    @method
  */
  checksum: function(data) {
    var h = this.__sha1hash__();
    data = XT.typeOf(data) === XT.T_HASH ? XT.json(data) : data;
    return h.update(data).digest('hex');
  },
  
  
  /**
    Creates a unique session id from a random MD5 hash.
    
    @returns {String} A unique MD5 session id.
    @method
  */
  id: function() {
    var h = this.__md5hash__();
    return h.update(Math.random().toString()).digest('hex');
  },
  
  /**
    Returns a timestamp in milliseconds.
    
    @returns {Number} The current time in milliseconds.
  */
  timestamp: function() { return new Date().getTime(); },
  
  /**
    Shared SHA1 hash generator for checksum calculations
    of the session datasets.
    
    @property
  */
  __sha1hash__: function() { return XT.crypto.createHash('sha1'); },
  
  /**
    Shared MD5 hash generator for creating *unique*
    session id's.
  
    @property
  */
  __md5hash__: function() { return XT.crypto.createHash('md5'); },

  initSession: function(session) {
    session.sid = XT.Session.id();
    session.created = XT.Session.timestamp();
  },
  
 pollCache: function() {

   // will be set to poll the cache for invalid or
   // expired sessions and remove them
   
   // XT.log("Polling cache for expired sessions");
   
   // var now = XT.Session.timestamp(),
   //     timeout = XT.sessionStore.sessionTimeout;
   
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

             if (!XT.Session.isActiveSession(data)) {
               var key = '%@:%@:%@'.f(
                 data.userName,
                 data.sid,
                 data.organization
               );
               XT.cache.del(key);
             }
           });
         }
       });
     }
   });
 },

 /**
 */
 isActiveSession: function(sessionData) {
   var now = XT.Session.timestamp();
   var timeout = XT.Session.sessionTimeout;
   var diff = Math.abs(now - sessionData.lastModified);
   if (diff > timeout) {
     return false;
   } else {
     return true;
   }
 },
 
});


XT.run(function() {

  // grab the session-timeout from the configuration and calculate
  // that for the appropriate number of milliseconds
  XT.Session.sessionTimeout = XT.opts.t ? XT.opts.t * 60000 : 900000; // default to 15 minutes

  // share this information with the world...  
  XT.log("Session timeout has been set to %@ minutes (%@ milliseconds)".f(XT.opts.t, XT.Session.sessionTimeout));

  // go ahead and poll it from the start to clear out any invalid
  // sessions since the node server is just starting up
  // process.once('xtCacheAvailable', XT.sessionStore.pollCache);
  XT.Session.pollCache();

  // set an interval for polling the cache for these expired sessions
  XT.__pollingTimer__ = setInterval(XT.Session.pollCache, 60000 /* 1 minute */);
});
