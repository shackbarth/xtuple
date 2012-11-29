create or replace function xt.grp_did_change() returns trigger as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

  var sql;
  switch (TG_OP)
  {
  case 'INSERT':
    sql = 'insert into xt.userrole (userrole_id, userrole_name, userrole_descrip) values ($1, $2, $3)';
    break;
  case 'UPDATE':
   sql = 'update xt.userrole set userrole_name = $2, userrole_descrip = $3 where userrole_id = $1';
    break;
  case 'DELETE':
    sql = 'delete from xt.userrole where userrole_id = $1';
    plv8.execute(sql, [OLD.grp_id]);
    return OLD;
  }
  plv8.execute(sql, [NEW.grp_id, NEW.grp_name, NEW.grp_descrip]);
  return NEW;

$$ language plv8;
