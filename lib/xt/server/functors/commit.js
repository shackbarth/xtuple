
/** @class
*/
XT.commitRecord = XT.functor.create(
  /** @lends XT.commitRecord.prototype */ {

  handle: function(xtr) {
    var hash = xtr.get('payloadData'),
        query = "select private.commit_record('%@')".f(hash);

    XT.debug("Sending to database: %@".f(query));

    XT.db.query(query, function(err, res) {
      if(err) 
        return issue(XT.close("Error from database response: %@".f(err.message), xtr));
      xtr.write(XT.json(res)).close();
    });
  },

  /** @property */
  handles: 'commitRecord',

  /** @private */
  className: 'XT.commitRecord' 

});
