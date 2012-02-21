
/** @class
*/
xt.functify = xt.functor.create(
  /** @lends xt.functify.prototype */ {

  handle: function(xtr) {
    var payload = xtr.get('payloadSafe'),
        query = "select xm.dispatchify('{params}')".f(
          { params: payload });

    xt.debug("Sending to database: %@".f(query));

    xt.db.query(
      query,
      function(e, r) {
        if(e) return issue(xt.close("Error from database response: %@".f(xt.inspect(e)), xtr));

        xtr.write(r).close();
      }
    );

  },

  /** @property */
  handles: 'callFunction',

  /** @private */
  className: 'xt.functify' 

});

