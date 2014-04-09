
CREATE OR REPLACE FUNCTION createAccountingPeriod(DATE, DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pStartDate ALIAS FOR $1;
  pEndDate ALIAS FOR $2;

BEGIN

  RETURN createAccountingPeriod(pStartDate, pEndDate, NULL, NULL);

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createaccountingperiod(DATE, DATE, INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pStartDate ALIAS FOR $1;
  pEndDate ALIAS FOR $2;
  pYearPeriodId ALIAS FOR $3;
  pQuarter ALIAS FOR $4;
  _periodid INTEGER;
  _check INTEGER;
  _r RECORD;
  _initial BOOLEAN;
  _number INTEGER;

BEGIN

--  Make that the passed start date doesn't fall into any existing period
  SELECT period_id INTO _check
  FROM period
  WHERE (pStartDate BETWEEN period_start AND period_end);
  IF (FOUND) THEN
    RETURN -1;
  END IF;

--  Make that the passed end date doesn't fall into any existing period
  SELECT period_id INTO _check
  FROM period
  WHERE (pEndDate BETWEEN period_start AND period_end);
  IF (FOUND) THEN
    RETURN -2;
  END IF;

--  Make that the passed start and end dates don't enclose an existing period
  SELECT period_id INTO _check
  FROM period
  WHERE ( (period_start >= pStartDate)
   AND (period_end <= pEndDate) );
  IF (FOUND) THEN
    RETURN -3;
  END IF;

-- Make sure period is inside fiscal year
  SELECT yearperiod_id INTO _check
  FROM yearperiod
  WHERE ((yearperiod_id=pYearPeriodId)
  AND (pStartDate>=yearperiod_start)
  AND (pEndDate<=yearperiod_end));
  IF NOT (FOUND) THEN
    RETURN -4;
  END IF;

--  Determine if this is the initial accounting period
  SELECT CASE WHEN(count(*) > 0) THEN FALSE
              ELSE TRUE
         END INTO _initial
  FROM period;

-- Determine the next number
  SELECT COALESCE(MAX(period_number),0) + 1 INTO _number
  FROM period
  WHERE (period_yearperiod_id=pYearPeriodId);

--  Create the new accounting period
  SELECT NEXTVAL('period_period_id_seq') INTO _periodid;
  INSERT INTO period
  ( period_id, period_start, period_end, period_closed, period_freeze, 
    period_initial, period_number, period_yearperiod_id, period_quarter )
  VALUES
  ( _periodid, pStartDate, pEndDate, FALSE, FALSE, _initial, _number, pYearPeriodId, pQuarter );

--  Post any unposted G/L Transactions into the new period
  FOR _r IN SELECT DISTINCT gltrans_sequence
            FROM gltrans
            WHERE ( (NOT gltrans_posted)
             AND (gltrans_date BETWEEN pStartDate AND pEndDate) ) LOOP
    PERFORM postIntoTrialBalance(_r.gltrans_sequence);
  END LOOP;

  RETURN _periodid;

END;
$$ LANGUAGE 'plpgsql';

