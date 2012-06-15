

/** @class
*/
XT.Functor.create(
  /** @lends ... */ {

  /** @private */
  handle: function(payload, session, ack, handling) {
      if (handling === 'session/select') {
        if (payload === XT.SESSION_FORCE_NEW) {
          session.forceNew().ready(function(session) {
            var state = session.get('state');
            if (state === XT.SESSION_ERROR) {
              ack(session.get('error'), session);
            } else {
              // we assume valid
              session.set('state', XT.SESSION_VALID);
              ack(session.get('details'), session);
            }
          });
        } else {
          var available = session.get('available');
          var sid;
          
          // so we need to account for the case when a selection is
          // made for a bad session or a session that expired before
          // the selection was made
          if (available && available.length >= payload) {
            
            // TODO: eh this probably shouldn't be in a try catch...
            try {
              sid = available[payload].sessionData.sid;
            } catch(err) { sid = null; }
          } else { sid = null; }

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
        XT.Session.create({
          username: username,
          password: password,
          organization: organization
        }).ready(function(session) {
          var state = session.get('state');
          if (state === XT.SESSION_ERROR) {
            ack(session.get('error'), session); 
          } else if (state === XT.SESSION_MULTIPLE) {
            var available = session.get('available');
            ack(available, session);
          } else if (state === XT.SESSION_VALID) {
            ack(session.get('details'), session);
          }
        });
      }
  },

  /** @private */
  handles: "session/request session/select".w(),
  
});
