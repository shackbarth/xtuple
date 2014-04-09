
CREATE OR REPLACE FUNCTION createAccountingYearPeriod(DATE, DATE) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pStartDate ALIAS FOR $1;
  pEndDate ALIAS FOR $2;
  _yearperiodid INTEGER;
  _check INTEGER;
  _checkBool BOOLEAN;
  _r RECORD;
  _initial BOOLEAN;

BEGIN

--  Make that the passed start date doesn''t fall into any existing yearperiod
  SELECT yearperiod_id INTO _check
  FROM yearperiod
  WHERE (pStartDate BETWEEN yearperiod_start AND yearperiod_end);
  IF (FOUND) THEN
    RETURN -1;
  END IF;

--  Make that the passed end date doesn''t fall into any existing yearperiod
  SELECT yearperiod_id INTO _check
  FROM yearperiod
  WHERE (pEndDate BETWEEN yearperiod_start AND yearperiod_end);
  IF (FOUND) THEN
    RETURN -2;
  END IF;

--  Make that the passed start and end dates don''t enclose an existing yearperiod
  SELECT yearperiod_id INTO _check
  FROM yearperiod
  WHERE ( (yearperiod_start >= pStartDate)
   AND (yearperiod_end <= pEndDate) );
  IF (FOUND) THEN
    RETURN -3;
  END IF;

--  Make sure that the passed start is prior to the end date
  SELECT (pStartDate > pEndDate) INTO _checkBool;
  IF (_checkBool) THEN
    RETURN -5;
  END IF;

--  Determine if this is the initial accounting yearperiod
  SELECT CASE WHEN(count(*) > 0) THEN FALSE
              ELSE TRUE
         END INTO _initial
  FROM yearperiod;

--  Create the new accounting yearperiod
  SELECT NEXTVAL(''yearperiod_yearperiod_id_seq'') INTO _yearperiodid;
  INSERT INTO yearperiod
  ( yearperiod_id, yearperiod_start, yearperiod_end, yearperiod_closed )
  VALUES
  ( _yearperiodid, pStartDate, pEndDate, FALSE );

  RETURN _yearperiodid;

END;
' LANGUAGE 'plpgsql';

