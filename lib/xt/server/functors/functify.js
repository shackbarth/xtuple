
/** @class
*/
xt.functify = xt.functor.create(
  /** @lends xt.functify.prototype */ {

  handle: function(xtr) {
    var func = xtr.get('payloadJSON.functionName'),
        payload = xtr.get('payloadSafe'),
        query = "select xm.{funcName}('{param}')".f(
          { funcName: func, param: payload });

    xt.debug("Sending to database: %@".f(query));

    xt.db.query(
      query,
      function(e, r) {
        if(e) return issue(xt.close("Error from database response: %@".f(e.message), xtr));

        xtr.write(r).close();
      }
    );

  },

  /** @property */
  handles: 'callFunction',

  /** @private */
  className: 'xt.functify' 

});

