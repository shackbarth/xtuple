

/** @class
*/
XT.requestSession = XT.functor.create(
  /** @lends XT.requestSession.prototype */ {

  /** @private */
  handle: function(xtr) {
    var payload = xtr.get('payloadJSON'),
        user = payload.username,
        pass = payload.password,
        sid = payload.sid;
    if(XT.none(pass)) return issue(XT.close("Must have password", xtr)); // need real errors
    if(XT.none(user)) return issue(XT.close("Must have username", xtr)); // need real errors
    if(sid) XT.sessionStore.validateSession(xtr, this.success);
    else XT.sessionStore.createSession(xtr, this.success); 
  },

  /**
    When a session is established or validated successfully this method
    is called to complete the request.

    @param {XT.session} session The loaded session object.
    @param {XT.Response} response The xt response object.

    @method
    @public
  */
  success: function(session, xtr) {
    if(XT.none(session))
      return issue(XT.close("Reported success on load/creation of session but no session available", xtr));
    xtr.write(session.get('data')).close();
  },

  /** @private */
  handles: 'requestSession',
  
  /** private */
  needSession: NO,

  /** @private */
  className: 'XT.requestSession'

});
