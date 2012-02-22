
/** @class
*/
XT.dispatch = XT.functor.create(
  /** @lends XT.dispatch.prototype */ {

  /** @private */
  handle: function(xtr) {
    var hash = xtr.get('payloadData'),
        query = "select xt.dispatch('%@')".f(hash);

    XT.debug("Sending to database: %@".f(query));

    XT.db.query(query, function(err, res) {
      if(err) 
        return issue(XT.close("Error from database response: %@".f(err.message), xtr));
      xtr.write(XT.json(res)).close();
    });
  },

  /** @private */
  handles: 'dispatch',

  /** @private */
  className: 'XT.dispatch' 

});

