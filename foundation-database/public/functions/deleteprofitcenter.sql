CREATE OR REPLACE FUNCTION deleteProfitCenter(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pid ALIAS FOR $1;

BEGIN
  IF (EXISTS(SELECT accnt_id
             FROM accnt, prftcntr
             WHERE ((accnt_company=prftcntr_number)
               AND  (prftcntr_id=pid))
            )) THEN
    RETURN -1;
  END IF;

  DELETE FROM prftcntr
  WHERE (prftcntr_id=pid);

  RETURN pid;

END;
' LANGUAGE 'plpgsql';
