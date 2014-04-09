
CREATE OR REPLACE FUNCTION changeAccountingYearPeriodDates(INTEGER, DATE, DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPeriodid ALIAS FOR $1;
  pStartDate ALIAS FOR $2;
  pEndDate ALIAS FOR $3;
  _check INTEGER;
  _checkBool BOOLEAN;
  _r RECORD;

BEGIN

--  Check to make sure that the passed yearperiod is not closed
  IF ( ( SELECT yearperiod_closed
         FROM yearperiod
         WHERE (yearperiod_id=pPeriodid) ) ) THEN
    RETURN -1;
  END IF;

--  Check to make sure that the passed start date does not fall
--  into another yearperiod
  SELECT yearperiod_id INTO _check
  FROM yearperiod
  WHERE ( (pStartDate BETWEEN yearperiod_start AND yearperiod_end)
    AND (yearperiod_id <> pPeriodid) )
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -2;
  END IF;

--  Check to make sure that the passed end date does not fall
--  into another yearperiod
  SELECT yearperiod_id INTO _check
  FROM yearperiod
  WHERE ( (pEndDate BETWEEN yearperiod_start AND yearperiod_end)
    AND (yearperiod_id <> pPeriodid) )
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -3;
  END IF;

--  Check to make sure that the passed yearperiod is not closed
  IF ( ( SELECT (count(period_id) > 0)
         FROM period
         WHERE ((period_yearperiod_id=pPeriodid)
          AND (period_start < pStartDate OR period_end > pEndDate)) ) ) THEN
    RETURN -4;
  END IF;

--  Make sure that the passed start is prior to the end date
  SELECT (pStartDate > pEndDate) INTO _checkBool;
  IF (_checkBool) THEN
    RETURN -5;
  END IF;


--  Alter the start and end dates of the pass period
  UPDATE yearperiod
  SET yearperiod_start=pStartDate, yearperiod_end=pEndDate
  WHERE (yearperiod_id=pPeriodid);

--  All done
  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';

