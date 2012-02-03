

/** @class
*/
xt.requestSession = xt.functor.create(
  /** @lends xt.requestSession.prototype */ {

  /** @method */
  handle: function(xtr) {
    var payload = xtr.get('payloadJSON'),
        u = payload.username,
        p = payload.password,
        s = payload.sid;
    if(xt.none(p)) return issue(xt.close("Must have password", xtr)); // need real errors
    if(xt.none(u)) return issue(xt.close("Must have username", xtr)); // need real errors
    if(s) xt.sessionStore.validateSession(xtr, this.success);
    else xt.sessionStore.createSession(xtr, this.success); 
  },

  success: function(session, xtr) {
    if(xt.none(session))
      return issue(xt.close("Reported success on load/creation of session but no session available", xtr));
    xtr.write(session.get('data')).close();
  },

  /** @property */
  handles: 'requestSession',
  
  needSession: NO,

  /** @private */
  className: 'xt.requestSession'

});

////////////// /** @class
////////////// */
////////////// xt.requestSession = xt.functor.create(
//////////////   /** @lends xt.requestSession.prototype */ {
////////////// 
//////////////   handle: function(xtr) {
//////////////     var p = xtr.get('payloadJSON');
//////////////     
//////////////     xt.debug(p);
//////////////     
//////////////     if(xt.none(p))
//////////////       return issue(xt.close("Missing information in session request", xtr)); 
//////////////     this.validateUser(p, xtr); 
//////////////   },
////////////// 
//////////////   validateUser: function(payload, xtr) {
////////////// 
//////////////     var u = payload.username,
//////////////         p = payload.password,
//////////////         s = payload.sid;
////////////// 
//////////////     xt.debug("validateUser %@, %@, %@".f(payload.username, payload.password || '', payload.sid));
////////////// 
//////////////     if(!xt.none(s)) {
//////////////       
//////////////       xt.debug("SID HAD A VALUE %@".f(s));
//////////////       
//////////////       if(xt.sessionStore.exists(s))
//////////////         return xtr.write({ username: u, sid: s }).close();
//////////////       else
//////////////         xt.debug("xt.sessionStore.exists returned false");
//////////////     }
//////////////     
//////////////     var query = "select validate_user('{user}', '{password}')".f(
//////////////         { user: u, password: p });
////////////// 
//////////////     xt.db.query(query, function(e, r) {
//////////////       if(e) return issue(xt.close("Error during user validation, %@".f(e.toString()), xtr));
//////////////       
//////////////       xt.debug(r);
//////////////       
//////////////       var row = r.rows[0];
//////////////       if(row.validate_user) {
//////////////         var session = xt.sessionStore.createSession({ 
//////////////           user: u, ip: xtr.get('info.clientAddress')
//////////////         });
//////////////         
//////////////         xt.debug(session);
//////////////         
//////////////         return xtr.write({ username: u, sid: session.get('sid') }).close();
//////////////       }
//////////////       else {
//////////////         
//////////////         // we need to have error responses and header control in xt.response!
//////////////         issue(xt.close("Did not supply the client with a valid session, " +
//////////////           "unable to authenticate user (%@)".f(u), xtr));
//////////////       }
//////////////     });
////////////// 
//////////////   },
////////////// 
//////////////   /** @property */
//////////////   handles: 'requestSession',
////////////// 
//////////////   /** @private */
//////////////   className: 'xt.requestSession' 
////////////// 
////////////// });

