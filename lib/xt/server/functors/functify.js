
/** @class
*/
XT.functify = XT.functor.create(
  /** @lends XT.functify.prototype */ {

  handle: function(xtr) {
    var func = xtr.get('payloadJSON.functionName'),
        payload = xtr.get('payloadSafe'),
        query = "select xm.{funcName}('{param}')".f(
          { funcName: func, param: payload });

    XT.debug("Sending to database: %@".f(query));

    XT.db.query(
      query,
      function(e, r) {
        if(e) return issue(XT.close("Error from database response: %@".f(e.message), xtr));

        xtr.write(r).close();
      }
    );

  },

  /** @property */
  handles: 'callFunction',

  /** @private */
  className: 'XT.functify' 

});

