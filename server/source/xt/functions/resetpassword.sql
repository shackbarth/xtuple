create or replace function xt.resetpassword(id text) returns text as $$
/* Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  var newPassword = "NEWPASSWORD";
  plv8.execute('update xt.usr set usr_password = $1 where usr_name = $2;', [newPassword, id]);
  return newPassword;

$$ language plv8;
