CREATE OR REPLACE FUNCTION numOfDatabaseUsers() RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _count INTEGER;

BEGIN

  -- in version 9.2.0 the column "procpid" was changed to just "pid" Incident #21852
  IF (compareversion('9.2.0') <= 0)
  THEN
  SELECT count(*)
    INTO _count
    FROM pg_stat_activity, pg_locks
   WHERE((database=datid)
     AND (classid=datid)
     AND (objsubid=2)
     AND (pg_stat_activity.pid = pg_backend_pid()));
  ELSE
  SELECT count(*)
    INTO _count
    FROM pg_stat_activity, pg_locks
   WHERE((database=datid)
     AND (classid=datid)
     AND (objsubid=2)
     AND (procpid = pg_backend_pid()));
  END IF;

  IF (_count IS NULL) THEN
    _count := 0;
  END IF;

  RETURN _count;

END;
$$ LANGUAGE 'plpgsql';
