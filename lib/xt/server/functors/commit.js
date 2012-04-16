
/** @class
*/
XT.Functor.create(
  /** @lends XT.commitRecord.prototype */ {

  handle: function(payload, session, ack, handling) {

    payload = XT.json(payload);

    var query = "select xt.commit_record('%@')".f(payload);

    ack(query);

    XT.debug("commitRecord handler() ", query);

    // var payload = xtr.get('payloadSafe'),
    //     session = xtr.get('session'),
    //     query = "select xt.commit_record('%@')".f(payload);

    // // important to note that querying needs to be handled through
    // // the session generated and stored in the response object
    // session.query(query, function(res) {

    //   // session queried callbacks are only used on
    //   // success and automatically handle returned errors
    //   xtr.write(res).close();
    // });
  },

  /** @property */
  handles: 'function/commitRecord',

  /** @private */
  className: 'XT.commitRecord' 

});
