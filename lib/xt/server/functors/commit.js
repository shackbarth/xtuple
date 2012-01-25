
/** @class
*/
xt.commitRecord = xt.functor.create(
  /** @lends xt.commitRecord.prototype */ {

  handle: function(xtr) {
  
    var type = xtr.get('info.json.recordType'),
        hash = JSON.stringify(xtr.get('info.json.dataHash')),
        query = "select private.commit_record('{type}', '{hash}')".f(
          { type: type, hash: hash });

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
  handles: 'commitRecord',

  /** @private */
  className: 'xt.commitRecord' 

});
