

/** @class
*/
XT.Functor.create(
  /** @lends XT.requestSession.prototype */ {

  /** @private */
  handle: function(payload, session, ack) {

      // we ignore the normal sessino object because it had
      // to have failed without the credentials in the payload
      var organization = payload.organization;
      var username = payload.username;
      var password = payload.password;

      // the session will attempt to authenticate the user
      // because of the credentials that are being passed in
      XT.Session.create().from({
        username: username,
        password: password,
        organization: organization
      }).ready(function(session) {
        var state = session.get('state');
        if (state === XT.SESSION_ERROR) {
          ack(session.get('error')); 
        } else if (state === XT.SESSION_MULTIPLE) {
          ack(session.get('available'));
        } else if (state === XT.SESSION_VALID) {
          ack(session.get('clientAttributes'));
        }
      });


      // XT.db.query(organization, query, function(err, ret) {
      //   if (err) {
      //     var error = new XT.SessionError(null, err.message, err.stack);
      //     return ack(error);
      //   }
      //   
      //   // generate a session
      //   XT.Session.create().from({
      //     organization: organization,
      //     username: username
      //   }).ready(function(session) {
      //     ack(session);
      //   });
      //    
      // });
     
    //var payload = xtr.get('payloadJSON');
    //var userName = payload.userName;
    //var password = payload.password;
    //var organization = payload.organization;
    //var sid = payload.sid;
    //var forceNew = payload.forceNew;
    //var success = this.success;
    //if(XT.none(userName)) return issue(XT.close("Must have username", xtr)); // need real errors

    //XT.sessionStore.getActiveSessionsForUser(userName, function(err, sessions) {
    //  if (sessions.length > 0 && !forceNew && !sid) {

    //    // reduce them to sessions related to the current organization
    //    var related = [];
    //    var idx = 0;
    //    var parts;
    //    var sessionOrganization;
    //    for (; idx < sessions.length; ++idx) {
    //      sessionOrganization = sessions[idx].sessionKey.split(':')[3];
    //      if (sessionOrganization === organization) {
    //        related.push(sessions[idx]);
    //      }
    //    }

    //    if (related.length > 0) {
    //      return xtr.write({ availableSessions: related }).close();
    //    }
    //  }

    //  if(XT.none(password)) return issue(XT.close("Must have password", xtr)); // need real errors
    //  if(XT.none(organization)) return issue(XT.close("Must have an organization", xtr)); // need real errors
    //  if(sid) {

    //    XT.debug("validating given session by id => %@".f(sid));

    //    XT.sessionStore.validateSession(xtr, success);
    //  } else {

    //    XT.debug("creating new session");

    //    XT.sessionStore.createSession(xtr, success); 
    //  }
    //});

  },

  /**
    When a session is established or validated successfully this method
    is called to complete the request.

    @param {XT.Session} session The loaded session object.
    @param {XT.Response} response The xt response object.

    @method
    @public
  */
  // success: function(session, xtr) {
  //   if(XT.none(session))
  //     return issue(XT.close("Reported success on load/creation of session but no session available", xtr));
  //   xtr.write(session.get('data')).close();
  // },

  /** @private */
  handles: 'session/request',
  
  /** private */
  needSession: false

});
