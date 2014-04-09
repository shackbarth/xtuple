CREATE OR REPLACE FUNCTION deleteSubaccount(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pid ALIAS FOR $1;

BEGIN
  IF (EXISTS(SELECT accnt_id
             FROM accnt, subaccnt
             WHERE ((accnt_company=subaccnt_number)
               AND  (subaccnt_id=pid))
            )) THEN
    RETURN -1;
  END IF;

  DELETE FROM subaccnt
  WHERE (subaccnt_id=pid);

  RETURN pid;

END;
' LANGUAGE 'plpgsql';
