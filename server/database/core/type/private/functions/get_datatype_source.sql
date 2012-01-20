create or replace function private.get_datatype_source(id integer) returns text immutable as $$
-- Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xm.ple.com/CPAL for the full text of the software license.
  select datatype_source from private.datatype where datatype_id=$1;
$$ language 'sql';
