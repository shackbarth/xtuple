create or replace function xt.createuser(username text, can_create_users boolean) returns integer as $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
declare
  
begin
  
  perform public.createuser(username, can_create_users);
  
  insert into xt.useracct (useracct_id, useracct_username)
  select usesysid::integer, usename::text 
  from pg_user
  where usename::text = username;
  
  return 1;
  
end;
$$ language 'plpgsql';
