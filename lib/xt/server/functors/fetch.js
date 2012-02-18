
/** @class
*/
XT.fetch = XT.functor.create(
  /** @lends XT.fetch.prototype */ {

  /** @private */
  handle: function(xtr) {
    var session = xtr.get('session');
        hash = xtr.get('payloadData'),
        query = "select xt.fetch('%@')".f(hash),
    session.query(query, function(err, res) {
      if(err) 
        return issue(XT.close("Error from database response: %@".f(err.message), xtr));
      xtr.write(XT.json(res)).close();
    });
  },

  /** @private */
  handles: 'fetch',

  /** @private */
  className: 'XT.fetch'

});
