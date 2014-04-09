
CREATE OR REPLACE FUNCTION releaseSohead(INTEGER) RETURNS BOOLEAN AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSoheadid ALIAS FOR $1;

BEGIN

  DELETE FROM soheadlock
   WHERE ( (soheadlock_sohead_id=pSoheadid)
     AND   (soheadlock_username=getEffectiveXtUser())
     AND   (soheadlock_procpid=pg_backend_pid()) );

  RETURN TRUE;
END;
' LANGUAGE 'plpgsql';

