
CREATE OR REPLACE FUNCTION deleteAccountingYearPeriod(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPeriodid ALIAS FOR $1;
  _check RECORD;

BEGIN

--  Check to make sure that the passed yearperiod is not closed
  IF ( ( SELECT yearperiod_closed
         FROM yearperiod
         WHERE (yearperiod_id=pPeriodid) ) ) THEN
    RETURN -1;
  END IF;

  -- this yearperiod is in use by existing periods
  IF (EXISTS(SELECT period_id
             FROM period
             WHERE (period_yearperiod_id=pPeriodid))) THEN
    RETURN -2;
  END IF;

--  Delete the yearperiod
  DELETE FROM yearperiod
  WHERE (yearperiod_id=pPeriodid);

  RETURN 1;

END;
' LANGUAGE 'plpgsql';

