create or replace function private.raise_exception(message text) returns void as $$
-- Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xm.ple.com/CPAL for the full text of the software license.
begin

  raise exception '%', message;
  
end;
$$ language 'plpgsql';
