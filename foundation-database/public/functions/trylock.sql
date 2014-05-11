CREATE OR REPLACE FUNCTION tryLock(integer, integer) RETURNS boolean AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pKey1 ALIAS FOR $1;
  pKey2 ALIAS FOR $2;
  _pid integer;
BEGIN

  /* The standard try lock ignores locks made by the current user in same
     session.  Check for ANY lock on this id, whether by this user or not */
  SELECT pid INTO _pid
  FROM pg_locks
  WHERE ((classid=pKey1)
   AND (objid=pKey2)
   AND (objsubid=2));

  IF (FOUND) THEN
    RETURN false;
  ELSE
    RETURN pg_try_advisory_lock(pKey1,pKey2);
  END IF;
   
END;
$$ LANGUAGE 'plpgsql';
