create or replace function xt.execute_query(query text) returns boolean volatile as $$
-- Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xm.ple.com/CPAL for the full text of the software license.
begin

  execute query;

  return true;
  
end;
$$ language 'plpgsql';
