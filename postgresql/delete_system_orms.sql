DO $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  var sql = "delete from xt.orm "
            + "where orm_json ~ $1;",
     deleteCondition = '"isSystem":true';
  return plv8.execute(sql, [deleteCondition]);

$$ language plv8;
