create or replace function xm.address_use_count(id integer) 
  returns integer stable as $$
-- Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xm.ple.com/CPAL for the full text of the software license.
  select addrUseCount($1)
$$ LANGUAGE 'sql';
