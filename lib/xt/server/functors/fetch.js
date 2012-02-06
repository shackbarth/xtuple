
/** @class
*/
xt.fetch = xt.functor.create(
  /** @lends xt.fetch.prototype */ {

  handle: function(xtr) {

    
    // xt.debug("in xt.fetch.handle");


    var payload = xtr.get('payloadData'),
        query = "select private.fetch(E'{payload}')".f(
          { payload: payload });
          
    var session = xtr.get('session');

    // xt.db.query(
    session.query(
      query,
      function(e, r) {
        if(e) return issue(xt.close("Error from database response: %@".f(e.message), xtr));

        var res = xt.json(r);

        xtr.write(res).close();
      }
    );

  },

  /** @property */
  handles: 'fetch',

  /** @private */
  className: 'xt.fetch'

});
