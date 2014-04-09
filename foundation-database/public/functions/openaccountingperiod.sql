
CREATE OR REPLACE FUNCTION openAccountingPeriod(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPeriodid ALIAS FOR $1;
  _r RECORD;

BEGIN

--  Check to make use that the period is closed
  IF ( ( SELECT (NOT period_closed)
         FROM period
         WHERE (period_id=pPeriodid) ) ) THEN
    RETURN -1;
  END IF;

  IF ( ( SELECT (count(period_id) > 0)
           FROM period
          WHERE ((period_end > (
            SELECT period_end 
            FROM period 
            WHERE (period_id=pPeriodId))
          )
           AND (period_closed)) ) ) THEN
    RETURN -3;
  END IF;
  
--  Make sure the year is open
  IF ( ( SELECT (yearperiod_closed)
         FROM yearperiod
           JOIN period ON (period_yearperiod_id=yearperiod_id)
         WHERE (period_id=pPeriodid) ) ) THEN
    RETURN -4;
  END IF;

--  Reset the period_closed flag
  UPDATE period
  SET period_closed=FALSE
  WHERE (period_id=pPeriodid);

--  Post any unposted G/L Transactions into the new period
  FOR _r IN SELECT DISTINCT gltrans_sequence
            FROM gltrans, period
            WHERE ( (NOT gltrans_posted)
             AND (gltrans_date BETWEEN period_start AND period_end)
             AND (period_id=pPeriodid) ) LOOP
    PERFORM postIntoTrialBalance(_r.gltrans_sequence);
  END LOOP;

  RETURN pPeriodid;

END;
$$ LANGUAGE 'plpgsql';

