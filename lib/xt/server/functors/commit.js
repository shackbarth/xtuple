
/** @class
*/
XT.Functor.create(
  /** @lends XT.commitRecord.prototype */ {

  handle: function(payload, session, ack, handling) {

    payload = XT.json(payload);

    var query = "select xt.commit_record('%@')".f(payload);

    session.query(query).ready(function(session) {
      if (session.get('state') === XT.SESSION_ERROR) {
        ack(session.get('error'));
      } else { ack(session.get('queryResult')); }
    });
  },

  /** @private */
  handles: 'function/commitRecord',

});
