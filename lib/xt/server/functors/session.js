

/** @class
*/
XT.Functor.create(
  /** @lends ... */ {

  /** @private */
  handle: function(payload, session, ack, handling) {

      XT.debug("handling ", handling);

      if (handling === 'session/select') {
        if (payload === XT.SESSION_FORCE_NEW) {

          XT.debug("forcing new session");
          
          session.forceNew().ready(function(session) {
            var state = session.get('state');
            if (state === XT.SESSION_ERROR) {
              XT.debug("error in force new");
              ack(session.get('error'), session);
            } else {
              // we assume valid
              XT.debug("should be valid force new");
              session.set('state', XT.SESSION_VALID);
              XT.debug(session.get('details'));
              ack(session.get('details'), session);
            }
          });
        } else {
          var available = session.get('available');

          XT.debug("need to load from ", available);

          var sid = available[payload].sessionData.sid;
          session.set('sid', sid);
          session.load().ready(function(session) {
            if (session.get('state') === XT.SESSION_ERROR) {
              ack(session.get('error'), session);
            } else {
              ack(session.get('details'), session);
            }
          });
        }
      } else {

        // we ignore the normal session object because it had
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
            XT.debug("error");
            ack(session.get('error'), session); 
          } else if (state === XT.SESSION_MULTIPLE) {
            XT.debug("multiple");
            
            var available = session.get('available');
            ack(available, session);
          } else if (state === XT.SESSION_VALID) {
            XT.debug("valid");
            ack(session.get('details'), session);
          }
        });
      }
  },

  /** @private */
  handles: "session/request session/select".w(),
  
});
