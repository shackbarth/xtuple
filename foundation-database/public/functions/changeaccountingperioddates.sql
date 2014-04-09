
CREATE OR REPLACE FUNCTION changeAccountingPeriodDates(INTEGER, DATE, DATE) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPeriodid ALIAS FOR $1;
  pStartDate ALIAS FOR $2;
  pEndDate ALIAS FOR $3;
  _check INTEGER;
  _r RECORD;

BEGIN

--  Check to make sure that the passed period is not closed
  IF ( ( SELECT period_closed
         FROM period
         WHERE (period_id=pPeriodid) ) ) THEN
    RETURN -1;
  END IF;

--  Check to make sure that the passed start date does not fall
--  into another period
  SELECT period_id INTO _check
  FROM period
  WHERE ( (pStartDate BETWEEN period_start AND period_end)
    AND (period_id <> pPeriodid) )
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -2;
  END IF;

--  Check to make sure that the passed end date does not fall
--  into another period
  SELECT period_id INTO _check
  FROM period
  WHERE ( (pEndDate BETWEEN period_start AND period_end)
    AND (period_id <> pPeriodid) )
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -3;
  END IF;

--  Check to make sure that the new passed start and end dates do not
--  orphan a posted G/L Transaction
  SELECT gltrans_id INTO _check
  FROM gltrans, period
  WHERE ( (gltrans_date BETWEEN period_start AND period_end)
   AND (gltrans_posted)
   AND (NOT (gltrans_date BETWEEN pStartDate AND pEndDate))
   AND (period_id=pPeriodid) )
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -4;
  END IF;

--  Alter the start and end dates of the pass period
  UPDATE period
  SET period_start=pStartDate, period_end=pEndDate
  WHERE (period_id=pPeriodid);

--  Post any unposted G/L Transactions into the period
  FOR _r IN SELECT DISTINCT gltrans_sequence
            FROM gltrans
            WHERE ( (NOT gltrans_posted)
             AND (gltrans_date BETWEEN pStartDate AND pEndDate) ) LOOP
    PERFORM postIntoTrialBalance(_r.gltrans_sequence);
  END LOOP;

--  All done
  RETURN 1;

END;
' LANGUAGE 'plpgsql';

