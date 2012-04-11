

/** @class
  The session store houses the accessor methods
  for creating, validating and managing sessions.
  Nearly all requests from the client require an
  authenticated user with an active session to execute
  their requests. 
*/
//// XT.sessionStore = XT.Object.create(
////   /** @lends XT.sessionStore.prototype */ {
//// 
////   //.......................................
////   // Public API
////   //
//// 
////   /**
////     Attempts to create a new session for the current
////     client request and passed in xt response object. If
////     the user is authenticated then a session will be
////     generated and the session id will be passed back to
////     the client. If the user could not be successfully
////     authenticated the request will be closed.
//// 
////     @param {XT.Response} xtr The xt response object.
////     @param {Function} [callback] The callback to be executed on success.
////   */
////   createSession: function(socket, callback) {
////     var payload = socket.get('payloadJSON');
////     var userName = payload.userName;
////     var password = payload.password;
////     var organization = payload.organization;
////     var self = this;
////     var query;
//// 
////     query = "select validate_user('%@','%@')".f(userName, password);
////     XT.db.query(organization, query, function(err, ret) {
////       if(err) {
////         return issue(XT.close("Error authenticating user, '%@'".f(userName || 'none'), socket));
////       }
////       ret = ret.rows[0]; // only looking for single row response from query
////       if(ret.validate_user) {
////         self.loadUser(userName, organization, function(err, userKey) {
////           if(err) return issue(XT.close("Error loading user account form database", socket));
////           
////           // the session will store itself in the cache and will remove
////           // the reference to the xt response when it is done initializing
////           // to free it
////           var session = XT.Session.create({ userKey: userKey, organization: organization, socket: socket, userName: userName });
////           
////           if(callback && XT.typeOf(callback) === XT.T_FUNCTION) {
////             session._xt_readyQueue.push(function() {
////               callback(session, socket);
////             });
////           }
////         });
////       } else {
////         issue(XT.close("Could not validate user, '%@'".f(userName || 'none'), socket));
////       }
////     });
////   },
//// 
////   /**
////     For data requests that require an authenticated user with
////     an active session, each request will pass through this
////     method. It attempts to validate the user and the session
////     and if successful will allow the request to continue otherwise
////     it will close the request with an error to the client.
////     
////     @param {XT.Response} response The xt response object generated
////       from the request.
////     @param {Function} [callback] The callback function to be executed
////       on succcessful completion of the session validation.
////     @method
////   */
////   validateSession: function(xtr, callback) {
////     var payload = xtr.get('payloadJSON');
////     var userName = payload.userName;
////     var sid = payload.sid;
////     var organization = payload.organization;
////     var ip = xtr.get('info.clientAddress');
////     var key = '%@:%@:%@:%@'.f(userName, ip, sid, organization);
//// 
////     XT.cache.hgetall(key, function(err, ret) {
////       if (err) return issue(XT.close("Error retrieving session data, %@".f(err), xtr));
////       if (XT.none(ret) || Object.keys(ret).length <= 0)
////         return issue(XT.close("Invalid session", xtr));
////         
////       var session = XT.Session.create({ 
////         data: ret, 
////         xtr: xtr, 
////         userName: userName, 
////         userKey: 'user:%@'.f(userName), 
////         organization: organization,
////         sid: sid
////       });
//// 
////       if (callback && XT.typeOf(callback) === XT.T_FUNCTION) {
////         session._xt_readyQueue.push(function() {
////           callback(session, xtr);
////         });
////       }
////     });
//// 
////   },
//// 
////   /**
////   */
////   getActiveSessionsForUser: function(userName, callback) {
////     
////     var self = this;
//// 
////     XT.cache.keys("%@:*".f(userName), function(err, sessions) {
////       if (err) return callback(err);
////       if (sessions.length <= 0) return callback(null, []);  
//// 
////       var idx = 0;
////       var activeSessions = []; 
////       process.addListener('%@:ACTIVE_SESSION_SEARCH'.f(userName), function(isActive, sessionKey, sessionData) {
////         idx++;
////         if (isActive) activeSessions.push({ sessionKey: sessionKey, sessionData: sessionData });
////         if (idx === sessions.length) {
////           process.removeAllListeners('%@:ACTIVE_SESSION_SEARCH'.f(userName));
////           callback(null, activeSessions);
////         }
////       });
//// 
////       sessions.forEach(function(sessionKey) {
////         XT.cache.hgetall(sessionKey, function(err, sessionData) {
////           if (err || !self.isActiveSession(sessionData)) {
////             process.emit('%@:ACTIVE_SESSION_SEARCH'.f(userName), false);
////           } else {
////             process.emit('%@:ACTIVE_SESSION_SEARCH'.f(userName), true, sessionKey, sessionData); 
////           }
////         });
////       });
//// 
////     });
////   },
////   
////   /**
////   */
////   getSession: function(xtr) {
////     this.validateSession(xtr);
////   },
//// 
////   //.......................................
////   // Private API
////   //
//// 
////   /**
////     Attempts to load the user into the cache. If the user
////     is already loaded, does nothing but associate the key
////     to the session otherwise it must load the user from
////     the database into the cache and then associate it with
////     the session. The callback is expected to handle error
////     cases.
//// 
////     @param {String} username The username to retrieve.
////     @param {Function} callback The callback function to call.
////     @param {Object} [context] The context to execute the callback as.
////     @param {Boolean} [force] Whether or not to force a reload from
////       the database for user data.
////     @method
////   */
////   loadUser: function(userName, organization, callback, context, force) {
//// 
////     if (XT.none(userName)) return;
////     if (XT.typeOf(callback) !== XT.T_FUNCTION) return;
////     if (XT.none(context)) context = this;
//// 
////     var func = function(err, ret) {
////       callback.call(context, err, ret); 
////     }
//// 
////     var userKey = 'user:%@'.f(userName);
////     var query;
//// 
////     // need to grab all of the user information from the cache if
////     // the user has already been loaded and, if not, load them
////     // from the database and store them in the cache for future
////     // reference
////     XT.cache.hgetall(userKey, function(err, ret) {
//// 
////       // allow the callback to handle error case
////       if (err && !force) return func(err);
////       if (XT.none(ret) || Object.keys(ret).length == 0 || force) {
//// 
////         XT.debug("Loading user ('%@') from the database into the cache".f(userName));
////         
////         // user not loaded into the cache so we need to grab
////         // it from the database and load it into the store
////         query = "select * from xm.user_account where username='%@'".f(userName);
////         XT.database.query(organization, query, function(err, ret) {
//// 
////           // allow the callback to handle error case
////           if(err) return func(err);
////           ret = ret.rows[0];
//// 
////           // if there is nothing the user doesn't exist?
////           if(XT.none(ret)) return func(XT.warn("User did not exist ('%@')".f(userName)));
////           
////           // we have valid data for the user and we know exactly
////           // what the key will be for them, shove the object into
////           // the cache as a hash and then pass the key into the
////           // callback for success
////           XT.cache.hmset(userKey, ret);
////         });
////       }
//// 
////       // all done
////       func(null, userKey); 
////     }); 
////   },
//// 
////   /**
////   */
////   deleteSession: function() {
////   },
//// 
////   /**
////     Automatically set to run at fixed intervals this asynchronous
////     polling method checks for sessions in the cache and determines
////     if they are expired based on server configuration. If the session
////     is expired it will be removed from the cache thus forcing any
////     client attempting to use the session to reauthenticate. This
////     method does not need to be called directly and is managed by
////     the server configuration options.
////     
////     @method
////   */
////   pollCache: function() {
//// 
////     // will be set to poll the cache for invalid or
////     // expired sessions and remove them
////     
////     // XT.log("Polling cache for expired sessions");
////     
////     // var now = XT.Session.timestamp(),
////     //     timeout = XT.sessionStore.sessionTimeout;
////     
////     // first find all of the users that may have sessions and
////     // that are just sitting in the cache
////     XT.cache.keys('user:*', function(e, loadedUsers) {
////       if(e) return issue(XT.warn("Could not poll cache for active users"));
////       var i = 0,
////           l = loadedUsers.length;
////       for(; i<l; ++i) {
////         var user = loadedUsers[i].split(':')[1];
////         
////         // next we need to iterate over them and find any
////         // sessions the cache may have for each user
////         XT.cache.keys('%@:*'.f(user), function(e, sessionsFor) {
////           if(e) return issue(XT.warn("Could not poll cache for active sessions"));
////           var i = 0,
////               l = sessionsFor.length;
////           for(; i<l; ++i) {
////             var sessionKey = sessionsFor[i];
////             
////             // now grab the session data and see if the session is
////             // old enough to remove
////             XT.cache.hgetall(sessionKey, function(e, data) {
////               if(e) return issue(XT.warn("Could not retrieve session data for entry while polling"));
//// 
////               if (!XT.sessionStore.isActiveSession(data)) {
////                 var key = '%@:%@:%@:%@'.f(
////                   data.userName,
////                   data.ip,
////                   data.sid,
////                   data.organization
////                 );
////                 XT.cache.del(key);
////               }
////             });
////           }
////         });
////       }
////     });
////   },
//// 
////   //................................................
////   // SOCKETS
////   //
//// 
////   /**
////   */
////   _xt_initSocket: function(socket) {
////     socket.on('requestSession', this._xt_handleRequest(socket));
////   },
//// 
////   _xt_handleRequest: function(socket) {
////     return function(data) {
////       var username = data.username;
////       var password = data.password;
////       var organization = data.organization;
////       var forNew = data.forceNew;
////       var sid = data.sid;
//// 
////       XT.sessionStore.getActiveSessionsForUser(username, function(err, sessions) {
////         if (sessions.length > 0 && !forceNew && !sid) {
//// 
////           // reduce them to sessions related to the current organization
////           var related = [];
////           var idx = 0;
////           var parts;
////           var sessionOrganization;
////           for (; idx < sessions.length; ++idx) {
////             sessionOrganization = sessions[idx].sessionKey.split(':')[3];
////             if (sessionOrganization === organization) {
////               related.push(sessions[idx]);
////             }
////           }
//// 
////           if (related.length > 0) {
////             return socket.json.emit('sessionsAvailable', related);
////           }
////         }
//// 
////         if(XT.none(password)) {
////           socket.json.emit('error', { message: "Must have a password" });
////         } else if(XT.none(organization)) {
////           return issue(XT.close("Must have an organization", xtr)); // need real errors
////           socket.json.emit('error', { message: "Must have an organization" });
////         } else if(sid) {
////           XT.debug("validating given session by id => %@".f(sid));
////           // XT.sessionStore.validateSession(xtr, success);
////         } else {
////           XT.debug("creating new session");
////           XT.sessionStore.createSession(socket, success); 
////         }
////       });
////     }
////   },
//// 
////   //
////   // END SOCKETS
////   //...............................................
//// 
////   /**
////   */
////   isActiveSession: function(sessionData) {
////     var now = XT.Session.timestamp();
////     var timeout = XT.sessionStore.sessionTimeout;
////     var diff = Math.abs(now - sessionData.lastModified);
////     if (diff > timeout) {
////       return false;
////     } else {
////       return true;
////     }
////   },
//// 
////   /** @private */
////   init: function() {
////     
////     // set an interval for polling the cache for these expired sessions
////     this.__pollingTimer__ = setInterval(this.pollCache, 60000 /* 1 minute */);
////   },
//// 
////   /** @private */
////   className: 'XT.sessionStore'
//// 
//// });
//// 
//// XT.run(function() {
//// 
////   // grab the session-timeout from the configuration and calculate
////   // that for the appropriate number of milliseconds
////   XT.sessionStore.sessionTimeout = XT.opts.t ? XT.opts.t * 60000 : 900000; // default to 15 minutes
//// 
////   // share this information with the world...  
////   XT.log("Session timeout has been set to %@ minutes (%@ milliseconds)".f(XT.opts.t, XT.sessionStore.sessionTimeout));
//// 
////   // go ahead and poll it from the start to clear out any invalid
////   // sessions since the node server is just starting up
////   // process.once('xtCacheAvailable', XT.sessionStore.pollCache);
////   XT.sessionStore.pollCache();
//// });
