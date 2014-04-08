
CREATE OR REPLACE FUNCTION logout() RETURNS integer AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  PERFORM pg_advisory_unlock(datid::integer, procpid)
     FROM pg_stat_activity
    WHERE(procpid = pg_backend_pid());

  RETURN 0;
END;
$$ LANGUAGE 'plpgsql';


