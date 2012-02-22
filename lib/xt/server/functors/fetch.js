
/** @class
*/
XT.fetch = XT.functor.create(
  /** @lends XT.fetch.prototype */ {

  /** @private */
  handle: function(xtr) {
    var payload = xtr.get('payloadJSON'),

        // important to note that querying needs to be handled through
        // the session generated and stored in the response object
        session = xtr.get('session'),
        query = "select xt.fetch('%@')";

    // note the use of payloadJSON property because this
    // has the encryptionKey property by default
    query = query.f(XT.json(payload));
    session.query(query, function(res) {

      // session queried callbacks are only used on
      // success and automatically handle returned errors
      xtr.write(XT.json(res)).close();
    });
  },

  /** @private */
  handles: 'fetch',

  /** @private */
  className: 'XT.fetch'

});
