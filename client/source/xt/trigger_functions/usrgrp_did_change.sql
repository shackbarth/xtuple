create or replace function xt.usrgrp_did_change() returns trigger as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

  var sql,
    ret;
  switch (TG_OP)
  {
  case 'INSERT':
    sql = 'insert into xt.useruserrole (useruserrole_id, useruserrole_userrole_id, useruserrole_username) values ($1, $2, $3)';
    plv8.execute(sql, [NEW.usrgrp_id, NEW.usrgrp_grp_id, NEW.usrgrp_username]);
    ret = NEW;
    break;
  case 'DELETE':
    sql = 'delete from xt.useruserrole where useruserrole_id = $1';
    plv8.execute(sql, [OLD.usrgrp_id]);
    ret = OLD;
  }
  return ret;

$$ language plv8;
