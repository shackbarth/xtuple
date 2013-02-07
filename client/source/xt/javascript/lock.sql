select xt.install_js('XT','Lock','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XT.Lock = {};
  
  XT.Lock.isDispatchable = true;
  
  XT.Lock.releaseLock = function (tableOid, recordId, username) {
    /* if (DEBUG) plv8.elog(NOTICE, "Releasing lock", tableOid, recordId, username); */
    var sql = "delete from xt.lock where lock_table_oid = $1 and lock_record_id = $2 and lock_username = $3",
  
    plv8.execute(sql, [tableOid, recordId, username]),
    /* TODO: can we find out the number of rows affected? Do we care? */

    return true;
  }
$$ );
