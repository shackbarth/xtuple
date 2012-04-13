
/** @class
*/
XT.Functor.create(
  /** @lends ... */ {

  /** @private */
  handle: function(payload, session, ack, handling) {

    // tmp hack    
    payload = XT.json(payload);

    var query = "select xt.fetch('%@')".f(payload);

    session.query(query).ready(function(session, result) {

      
      XT.debug("handle() query => result ", result, arguments.callee.caller.toString());


      if (session.get('state') === XT.SESSION_ERROR) {
        ack(session.get('error'));
      } else { ack(result); }
    });

    //var payload = xtr.get('payloadSafe'),
    //    session = xtr.get('session'),
    //    query = "select xt.fetch('%@')".f(payload);

    //// important to note that querying needs to be handled through
    //// the session generated and stored in the response object
    //session.query(query, function(res) {

    //  // session queried callbacks are only used on
    //  // success and automatically handle returned errors
    //  xtr.write(res).close();
    //});
  },

  /** @private */
  handles: 'function/fetch',

});
