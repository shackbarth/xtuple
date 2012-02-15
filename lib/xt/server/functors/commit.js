
/** @class
*/
xt.commitRecord = xt.functor.create(
  /** @lends xt.commitRecord.prototype */ {

  handle: function(xtr) {
  
    var type = xtr.get('payloadJSON.recordType'),
        hash = xtr.get('payloadData'),
        // query = "select private.commit_record('{type}', '{hash}')".f(
        //   { type: type, hash: hash });
        query = "select private.commit_record('{hash}')".f({ hash: xtr.get('payloadData') });

    xt.debug("Sending to database: %@".f(query));

    xt.db.query(
      query,
      function(e, r) {
        if(e) return issue(xt.close("Error from database response: %@".f(e.message), xtr));

        var res = xt.json(r);

        xt.debug("Writing to client: %@".f(res));

        xtr.write(res).close();
      }
    );

  },

  /** @property */
  handles: 'commitRecord',

  /** @private */
  className: 'xt.commitRecord' 

});
