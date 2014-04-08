
CREATE OR REPLACE FUNCTION numOfDatabaseUsers() RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _count INTEGER;

BEGIN

  SELECT count(*)
    INTO _count
    FROM pg_stat_activity, pg_locks
   WHERE((database=datid)
     AND (classid=datid)
     AND (objsubid=2)
     AND (procpid = pg_backend_pid()));
  IF (_count IS NULL) THEN
    _count := 0;
  END IF;

  RETURN _count;

END;
$$ LANGUAGE 'plpgsql';

