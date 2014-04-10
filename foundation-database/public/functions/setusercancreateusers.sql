DROP FUNCTION IF EXISTS setuserCanCreateUsers(TEXT, BOOLEAN);
CREATE OR REPLACE FUNCTION setuserCanCreateUsers(pUsername TEXT, pCreateUser BOOLEAN) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (pCreateUser) THEN
    EXECUTE 'ALTER USER "' || pUsername || '" CREATEROLE;';
  ELSE
    EXECUTE 'ALTER USER "' || pUsername || '" NOCREATEROLE;';
  END IF;
  RETURN TRUE;
END;
$$ LANGUAGE PLPGSQL;
