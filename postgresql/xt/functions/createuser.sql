create or replace function xt.createuser(username text, can_create_users boolean) returns integer as $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
begin

  insert into xt.useracct values (username);
  
  return public.createuser(username, can_create_users);
  
end;
$$ language 'plpgsql';
