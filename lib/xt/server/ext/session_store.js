

xt.sessionStore = xt.object.create(
  /** @lends xt.sessionStore.prototype */ {

  //.......................................
  // Public API
  //

  /**
  */
  createSession: function() {

    // take username, password and ip address
    // validate the username and password
    // on success continue else fail

  },

  /**
  */
  validateSession: function() {

    // take username, session id and ip address
    // and do a lookup to verify that the session
    // exists and is active

  },

  //.......................................
  // Private API
  //

  /**
  */
  loadUser: function() {
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



///////////// /** @class
///////////// */
///////////// xt.sessionStore = xt.object.create(
/////////////   /** @lends xt.sessionStore.prototype */ {
///////////// 
/////////////   /**
/////////////     Tests to see if an active session exists for the
/////////////     passed session id (hash).
///////////// 
/////////////     @param {String} sid The session id.
/////////////     @returns {Boolean} YES|NO if the session does exist.
/////////////   */
/////////////   exists: function(sid) {
/////////////     
/////////////     var s = this.get('sessions');
/////////////     
/////////////     xt.debug(s);
/////////////     
/////////////     ss = s[sid];
/////////////     
/////////////     xt.debug(ss);
/////////////     
/////////////     ss = this.sessionFromSid(sid);
/////////////     
/////////////     xt.debug(ss);
/////////////     
/////////////     return ss;
/////////////   },
///////////// 
/////////////   /**
/////////////     Attempts to retrieve an active session object from the
/////////////     given client data hash.
///////////// 
/////////////     @param {Object} info The client information data hash.
/////////////     @returns {xt.session} The active session object or null if none exists.
/////////////   */
/////////////   sessionFromInfo: function(info) {
/////////////     var i = this.get('ipSessions'),
/////////////         s = i[info.ip] ? i[info.ip][info.user] : null;
/////////////     return s; 
/////////////   },
///////////// 
/////////////   /**
/////////////     Attempts to retrieve an active session object from the
/////////////     given session id.
///////////// 
/////////////     @param {String} sid The session id hash.
/////////////     @returns {xt.session} The active session object or null if none exists.
/////////////   */
/////////////   sessionFromSid: function(sid) {
/////////////     var s = this.get('sessions');
/////////////     return s[sid] ? s[sid] : null;
/////////////   },
///////////// 
/////////////   /**
/////////////     Validates a session. Can take a xt session object or a
/////////////     session id to determine if the session exists and is
/////////////     currently valid. Returns false if the session cannot
/////////////     be found.
///////////// 
/////////////     @param {String|xt.session} ses The session id or xt session object.
/////////////     @returns {Boolean} YES|NO on whether the session is active and valid or not.
/////////////   */
/////////////   validate: function(ses) {
/////////////     if(xt.typeOf(ses) === xt.t_string)
/////////////       ses = this.sessionFromSid(ses);
/////////////     if(xt.none(ses)) return NO;
/////////////     var t = xt.session.time(); 
/////////////     
/////////////     // PLACE HOLDER!!!
/////////////     var MAXDIF = 900000; // 15 minutes for development...
///////////// 
/////////////     return Math.abs(t - ses.lastUsed) >= MAXDIF ? NO : YES;
/////////////   },
///////////// 
/////////////   /**
/////////////     Storage of actual sessions.
///////////// 
/////////////     @property
/////////////   */
/////////////   sessions: {},
///////////// 
/////////////   /**
/////////////     Redundant storage of sessions by client ip address.
/////////////     Allows many sessions on the same ip.
///////////// 
/////////////     @property
/////////////   */
/////////////   ipSessions: {},
/////////////     
/////////////   /**
/////////////     Creates a new session with the given client information.
///////////// 
/////////////     @param {Object} info The client information hash.
/////////////     @returns {xt.session} A xt.session object.
/////////////   */
/////////////   createSession: function(info) {
/////////////     if(xt.none(info)) return NO;
/////////////     var s = this.get('sessions'),
/////////////         i = this.get('ipSessions'), n;
/////////////     n = xt.session.create({
/////////////       sid: xt.session.hash(),
/////////////       info: info
/////////////     });
/////////////     
/////////////     if(!i[info.ip]) i[info.ip] = {};
/////////////     i[info.ip][info.user] = n;
///////////// 
/////////////     // add this entry to the sessions store
/////////////     s[n.sid] = n;
///////////// 
/////////////     xt.debug('createSession', this.get('sessions'), this.get('ipSessions'));
///////////// 
/////////////     return n;
/////////////   },
///////////// 
/////////////   /**
/////////////     Removes a session from the internal store once it has
/////////////     been deactivated or become inactive.
///////////// 
/////////////     @param {String} sid The session id.
/////////////     @param {Object} info The client information data hash.
/////////////     @returns {Boolean} Returns YES|NO on success/failure respectively.
/////////////   */
/////////////   removeSession: function(sid, info) {
/////////////     var s = this.get('sessions'),
/////////////         i = this.get('ipSessions');
/////////////     s[sid] = null;
/////////////     i[info.ip][info.user] = null;
/////////////     delete s[sid];
/////////////     delete i[info.ip][info.user];
/////////////   },
///////////// 
/////////////   /** @private */
/////////////   className: 'xt.sessionStore'
///////////// 
///////////// });
