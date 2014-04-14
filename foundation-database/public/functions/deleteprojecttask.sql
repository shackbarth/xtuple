
CREATE OR REPLACE FUNCTION deleteProjectTask(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPrjtaskid ALIAS FOR $1;
  _row RECORD;
  _result INTEGER;
BEGIN

  SELECT * INTO _row
    FROM prjtask
   WHERE (prjtask_id=pPrjtaskid)
   LIMIT 1;
  IF (NOT FOUND) THEN
    RETURN -1;
  END IF;

  IF (COALESCE(_row.prjtask_hours_actual, 0.0) > 0.0) THEN
    RETURN -2;
  END IF;

  IF (COALESCE(_row.prjtask_exp_actual, 0.0) > 0.0) THEN
    RETURN -3;
  END IF;

  DELETE FROM comment
  WHERE ((comment_source='TA')
  AND (comment_source_id=pPrjtaskid));

  DELETE FROM prjtask
   WHERE (prjtask_id=pPrjtaskid);

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';

