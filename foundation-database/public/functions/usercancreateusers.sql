CREATE OR REPLACE FUNCTION userCanCreateUsers(TEXT) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
SELECT rolcreaterole OR rolsuper
  FROM pg_roles
 WHERE rolname=($1);
$$ LANGUAGE SQL;
