
/** @class
*/
xt.fetch = xt.functor.create(
  /** @lends xt.fetch.prototype */ {

  handle: function(xtr) {

    
    xt.debug("in xt.fetch.handle");


    var payload = xtr.get('payloadData'),
        query = "select private.fetch(E'{payload}')".f(
          { payload: payload });
    
    xt.debug("Sending to database: %@".f(query));

    xt.db.query(
      query,
      function(e, r) {
        if(e) return issue(xt.close("Error from database response: %@".f(xt.inspect(e)), xtr));

        var res = xt.json(r);

        xt.debug("Writing to client: %@".f(res));

        xtr.write(res).close();
      }
    );

  },

  /** @property */
  handles: 'fetch',

  /** @private */
  className: 'xt.fetch'

});
