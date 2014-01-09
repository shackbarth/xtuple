create or replace function xt.createuser(pUsername text, pCreateUsers boolean) returns integer as $$
declare
  _result integer;
begin
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xtuple.com/CPAL for the full text of the software license. */

  select public.createuser(pUsername, pCreateUsers) into _result;

  insert into xt.usrlite (usr_username, usr_propername, usr_active, usr_disable_export, usr_email)
  values (pUsername, '', false, false, '');

  return _result;
  
end
$$ language 'plpgsql' volatile;

