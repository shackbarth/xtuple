
CREATE OR REPLACE FUNCTION thawAccountingPeriod(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPeriodid ALIAS FOR $1;
  _r RECORD;

BEGIN

--  Check to make sure that the period is frozen
  IF ( ( SELECT (NOT period_freeze)
         FROM period
         WHERE (period_id=pPeriodid) ) ) THEN
    RETURN -2;
  END IF;

--  Check to make sure that the period is not closed
  IF ( ( SELECT (period_closed)
         FROM period
         WHERE (period_id=pPeriodid) ) ) THEN
    RETURN -1;
  END IF;

--  Reset the period_freeze flag
  UPDATE period
  SET period_freeze=FALSE
  WHERE (period_id=pPeriodid);

--  Post any unposted G/L Transactions into the period
  FOR _r IN SELECT DISTINCT gltrans_sequence
            FROM gltrans, accnt, period
            WHERE ( (gltrans_accnt_id=accnt_id)
             AND (NOT gltrans_posted)
             AND (gltrans_date BETWEEN period_start AND period_end)
             AND (period_id=pPeriodid) ) LOOP
    PERFORM postIntoTrialBalance(_r.gltrans_sequence);
  END LOOP;

  RETURN pPeriodid;

END;
' LANGUAGE 'plpgsql';

