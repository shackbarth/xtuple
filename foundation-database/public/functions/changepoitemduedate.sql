DROP FUNCTION IF EXISTS changepoitemduedate(integer, date);
CREATE OR REPLACE FUNCTION changePoitemDueDate(INTEGER, DATE) RETURNS INTEGER AS '
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPoitemid ALIAS FOR $1;
  pDate ALIAS FOR $2;

BEGIN

  IF ( ( SELECT (poitem_status IN (''C''))
         FROM poitem
         WHERE (poitem_id=pPoitemid) ) ) THEN
    RETURN -1;
  END IF;

  UPDATE poitem
  SET poitem_duedate=pDate
  WHERE (poitem_id=pPoitemid);

  RETURN pPoitemid;

END;
' LANGUAGE 'plpgsql';
