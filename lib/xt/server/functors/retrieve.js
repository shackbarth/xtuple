
/** @class
*/
XT.retrieveRecord = XT.Functor.create(
  /** @lends XT.retrieveRecord.prototype */ {

  /** @private */
  handle: function(xtr) {
    var payload = xtr.get('payloadSafe'),
        session = xtr.get('session'),
        query = "select xt.retrieve_record('%@')".f(payload);

    // important to note that querying needs to be handled through
    // the session generated and stored in the response object
    session.query(query, function(res) {

      // session queried callbacks are only used on
      // success and automatically handle returned errors
      xtr.write(res).close();
    });
  },

  /** @private */
  handles: 'retrieveRecord',

  /** @private */
  className: 'XT.retrieveRecord' 

});

