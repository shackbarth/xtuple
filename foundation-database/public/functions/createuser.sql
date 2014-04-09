DROP FUNCTION IF EXISTS createUser(TEXT, BOOLEAN);
CREATE OR REPLACE FUNCTION createUser(pUsername TEXT, pCreateUsers BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (pCreateUsers) THEN
    EXECUTE 'CREATE USER "' || pUsername || '" CREATEROLE   IN GROUP xtrole;';
  ELSE
    EXECUTE 'CREATE USER "' || pUsername || '" NOCREATEROLE IN GROUP xtrole;';
  END IF;
  RETURN 1;
END;
$$ LANGUAGE PLPGSQL;
