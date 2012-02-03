CREATE FUNCTION private.session_privilege() RETURNS privgranted AS $$
    SELECT ROW(*)::privgranted;
$$ LANGUAGE SQL;

/*create or replace function private.session_privilege() 
  returns privgranted as $$
-- Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xm.ple.com/CPAL for the full text of the software license.
  select * from privgranted;
$$ LANGUAGE 'sql';



select sessio

*/