create or replace function private.get_charrole_type_name(id integer) returns text immutable as $$
-- Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xm.ple.com/CPAL for the full text of the software license.

  select datatype_name
  from private.datatype
    join private.charrole on (charrole_datatype_id = datatype_id)
  where (charrole_id = $1);
   
$$ language 'sql';

