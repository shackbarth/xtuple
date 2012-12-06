create or replace function xt.usrpriv_did_change() returns trigger as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

  var sql,
    ret;
  switch (TG_OP)
  {
  case 'INSERT':
    sql = 'insert into xt.userpriv (userpriv_id, userpriv_username, userpriv_priv_id) values ($1, $2, $3)';
    plv8.execute(sql, [NEW.usrpriv_id, NEW.usrpriv_username, NEW.usrpriv_priv_id]);
    ret = NEW;
    break;
  case 'DELETE':
    sql = 'delete from xt.userpriv where userpriv_id = $1';
    plv8.execute(sql, [OLD.usrpriv_id]);
    ret = OLD;
  }
  return ret;

$$ language plv8;
