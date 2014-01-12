select xt.install_js('XM','Contact','xtuple', $$
  /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.Contact = {};

  XM.Contact.isDispatchable = true,
  
  XM.Contact.merge = function(sourceContactId, targetContactId, purge) {
    var err,
      sql = "select cntctmerge(src.cntct_id, tgt.cntct_id, $3) AS result " +
            "from cntct src, cntct tgt " +
            "where src.cntct_number = $1 " +
            " and tgt.cntct_number = $2;";

    if (!data.checkPrivilege("MergeContacts")) { 
      err = "Access denied."
    } else if (sourceContactId === undefined) {
      err = "Not defined";
    } else if (targetContactId === undefined) {
      err = "Not defined";
    } else if (purge === undefined) {
      err = "Not defined";
    }
    if(!err) {
      return plv8.execute(sql, [sourceContactId, targetContactId, purge])[0].result;
    }
    throw new Error(err);
  }

  XM.Contact.restore = function(mergeContactId) {
    var ret,
      sql = "select cntctrestore(cntct_id) AS result from cntct where cntct_number = $1;"
      err,
      data = Object.create(XT.Data);

    if(!data.checkPrivilege("MergeContacts")) {
      err = "Access denied."
     } else if (mergeContactId === undefined) {
       err = "Not defined";
     }
     if(!err) {
       return plv8.execute(sql, [mergeContactId])[0].result;
     }
     throw new Error(err);
  }

  XM.Contact.used = function(id) {
    return plv8.execute("select cntctused(cntct_id) AS result from cntct where cntct_number = $1;", [id])[0].result;
  }

$$ );

