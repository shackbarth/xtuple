CREATE OR REPLACE FUNCTION deleteCheck(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCheckid ALIAS FOR $1;

BEGIN
  IF (SELECT (NOT checkhead_void) OR checkhead_posted OR checkhead_replaced
              OR checkhead_deleted
              OR (checkhead_ach_batch IS NOT NULL AND checkhead_printed)
      FROM checkhead
      WHERE (checkhead_id=pCheckid) ) THEN
    RETURN -1;
  END IF;

  UPDATE checkhead
  SET checkhead_deleted=TRUE
  WHERE (checkhead_id=pCheckid);

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
