select xt.install_js('XM','Contact','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.Contact = {};

  XM.Contact.isDispatchable = true,
  
  XM.Contact.merge = function(sourceContactId, targetContactId, purge) {
    var err;

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
      return plv8.execute("select cntctmerge($1,$2,$3) AS result;", [sourceContactId, targetContactId, purge])[0].result;
    }
    throw new Error(err);
  }

  XM.Contact.restore = function(mergeContactId) {
    var ret,
      sql,
      err,
      data = Object.create(XT.Data);

    if(!data.checkPrivilege("MergeContacts")) {
      err = "Access denied."
     } else if (mergeContactId === undefined) {
       err = "Not defined";
     }
     if(!err) {
       return plv8.execute("select cntctrestore($1) AS result;", [mergeContactId])[0].result;
     }
     throw new Error(err);
  }

  XM.Contact.used = function(id) {
    return plv8.execute("select cntctused($1) AS result;", [id])[0].result;
  }

$$ );

