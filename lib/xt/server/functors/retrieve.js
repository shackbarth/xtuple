
/** @class
*/
xt.retrieveRecord = xt.functor.create(
  /** @lends xt.retrieveRecord.prototype */ {

  handle: function(xtr) {
    
    var type = xtr.get('payloadJSON.recordType'),
        id = xtr.get('payloadJSON.id'),
        payload = xtr.get('payloadData'),
        query = "select private.retrieve_record('{type}', '{id}'::integer)".f(
          { type: type, id: id });

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
  handles: 'retrieveRecord',

  /** @private */
  className: 'xt.retrieveRecord' 

});

