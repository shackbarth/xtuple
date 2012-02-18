
/** @class
*/
XT.dispatch = XT.Functor.create(
  /** @lends XT.dispatch.prototype */ {

  /** @private */
  handle: function(xtr) {
    var payload = xtr.get('payloadSafe'),
        session = xtr.get('session'),
        query = "select xt.dispatch('%@')".f(payload);

    // important to note that querying needs to be handled through
    // the session generated and stored in the response object
    session.query(query, function(res) {

      // session queried callbacks are only used on
      // success and automatically handle returned errors
      xtr.write(res).close();
    });
  },

  /** @private */
  handles: 'dispatch',

  /** @private */
  className: 'XT.dispatch' 

});

