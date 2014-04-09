
CREATE OR REPLACE FUNCTION closeAccountingYearPeriod(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pYearPeriodid ALIAS FOR $1;
  _result INTEGER;
BEGIN

--  Check to make sure that the yearperiod is not already closed
  IF ( ( SELECT yearperiod_closed
           FROM yearperiod
          WHERE (yearperiod_id=pYearPeriodid) ) ) THEN
    RETURN -1;
  END IF;

  IF ( ( SELECT (count(period_id) > 0)
           FROM period
          WHERE ((period_yearperiod_id=pYearPeriodid)
           AND (NOT period_closed)) ) ) THEN
    RETURN -10;
  END IF;

  IF ( ( SELECT (count(yearperiod_id) > 0)
           FROM yearperiod
          WHERE ((yearperiod_end< (
            SELECT yearperiod_end 
            FROM yearperiod 
            WHERE (yearperiod_id=pYearPeriodId))
          )
           AND (NOT yearperiod_closed)) ) ) THEN
    RETURN -11;
  END IF;

--  Should we check for a previous yearperiod existing already ?
--  If so then we should return -2 if one does not.

--  If we did the previous yearperiod we should check to make sure that
--  it is also closed. Returning -3 if it is not.

--  Make sure that the user is not trying to prematurely close the YearPeriod
  IF ( ( SELECT (yearperiod_end >= CURRENT_DATE)
           FROM yearperiod
          WHERE (yearperiod_id=pYearPeriodid) ) ) THEN
    RETURN -5;
  END IF;

--  Update the year end Retained Earnings
  SELECT updateRetainedEarnings(pYearPeriodid) INTO _result;
  IF (_result < 0) THEN
    RETURN _result;
  END IF;

  UPDATE yearperiod
    SET yearperiod_closed = TRUE
  WHERE yearperiod_id = pYearPeriodid;

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';

