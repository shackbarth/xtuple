create or replace function xt.grppriv_did_change() returns trigger as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

  var sql,
    ret;
  switch (TG_OP)
  {
  case 'INSERT':
    sql = 'insert into xt.userrolepriv (userrolepriv_id, userrolepriv_userrole_id, userrolepriv_priv_id) values ($1, $2, $3)';
    plv8.execute(sql, [NEW.grppriv_id, NEW.grppriv_grp_id, NEW.grppriv_priv_id]);
    ret = NEW;
    break;
  case 'DELETE':
    sql = 'delete from xt.userrolepriv where userrolepriv_id = $1';
    plv8.execute(sql, [OLD.grppriv_id]);
    ret = OLD;
  }
  return ret;

$$ language plv8;
