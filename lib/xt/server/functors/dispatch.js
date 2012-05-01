
/** @class
*/
XT.Functor.create(
  /** @lends XT.dispatch.prototype */ {

  /** @private */
  handle: function(payload, session, ack, handling, socket) {
    
    payload = XT.json(payload);

    var query = "select xt.dispatch('%@')".f(payload);

    socket.json.emit('debug', { message: "query to be run for dispatch => " + query });

    session.query(query).ready(function(session) {
      if (session.get('state') === XT.SESSION_ERROR) {
        ack(session.get('error'));
      } else { ack(session.get('queryResult')); }
    });
  },

  /** @private */
  handles: 'function/dispatch',

});

