
CREATE OR REPLACE FUNCTION logout() RETURNS integer AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (compareversion('9.2.0') <= 0)
  THEN
    PERFORM pg_advisory_unlock(datid::integer, pid)
     FROM pg_stat_activity
    WHERE(pid = pg_backend_pid());
  ELSE
    PERFORM pg_advisory_unlock(datid::integer, procpid)
       FROM pg_stat_activity
      WHERE(procpid = pg_backend_pid());
  END IF;

  RETURN 0;
END;
$$ LANGUAGE 'plpgsql';


