
CREATE OR REPLACE FUNCTION nextPeriodByInterval(INTEGER, INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPeriodid ALIAS FOR $1;
  pInterval ALIAS FOR $2;
  _periodid INTEGER;
BEGIN
  SELECT b.period_id INTO _periodid
    FROM period AS a, period AS b
   WHERE ((a.period_id=pPeriodid)
     AND  (b.period_start >= a.period_start))
   ORDER BY b.period_start
   LIMIT 1 OFFSET pInterval;
  IF (NOT FOUND) THEN
    RETURN -1;
  END IF;
  RETURN _periodid;
END;
' LANGUAGE 'plpgsql';

