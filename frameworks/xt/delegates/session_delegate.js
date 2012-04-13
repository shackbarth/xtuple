
/**
  @class

  The delegate responsible for responding to session related
  events when they are encountered. This delegate should be
  applied by registering itself with the XT.session object
  by setting the `delegate` property (@see XT#Session).
*/
XT.SessionDelegate = {
  /** @lends XT.SessionDelegate.prototype */

  /**
    Walk like a duck?
  */
  isSessionDelegate: true,

  /**
    Called before a request is made to the datasource to
    request a new session. The session hash can be modified
    to reflect any properties needed to be passed on.

    @method
    @param {Object} session A hash of the session's authentication
      credentials and flags.
  */
  willAcquireSession: function(session) {},

  /**
    Called once a valid session has been acquired.
    
    @method
    @param {Object} session A hash of the session's properties.
  */
  didAcquireSession: function(session) {},

  /**
    Called once a session request returns with a multiple
    sessions available code and requires either a selection
    from the available sessions or a flag to begin a new
    session is returned.

    If the delegate handles this request ensure that it returns
    a boolean true or the session handler will attempt to.

    @method
    @param {Array} available The available sessions to choose from.
    @param {Function} ack The ack method to be called by passing it an
      integer of the index of the chosen available session or the
      XT.SESSION_FORCE_NEW boolean flag if a new session is required.
    @returns {Boolean} true|false if the delegate handled the ack.
  */
  didReceiveMultipleSessions: function(available, ack) {},
  
  /**
    Called when a session was successfully logged out.

    @method
  */
  didLogoutSession: function() {}, 

  /**
    Called when the session is lost for any reason
    (even on successful logout). The reason code can
    be used to dictate further action based on what
    type of disconnect has been experienced.

    TODO: The reason should ultimately be a code?
    TODO: Is it even possible for a web app to determine
      network loss?

    Options:
      timeout
      network
      logout
      unknown

    @method
    @param {String} reason String indicator of what happened.
  */
  didLoseSession: function(reason) {},

  /**
    Called when there has been a session related error.

    @method
    @param {String} message The error message.
    @param {Number} code The error code.
  */
  didError: function(message, code) {}

};
