
CREATE OR REPLACE FUNCTION freezeAccountingPeriod(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPeriodid ALIAS FOR $1;

BEGIN

--  Check to make use that the period is not already frozen
  IF ( ( SELECT period_freeze
         FROM period
         WHERE (period_id=pPeriodid) ) ) THEN
    RETURN -2;
  END IF;

--  Set the period_freeze flag
  UPDATE period
  SET period_freeze=TRUE
  WHERE (period_id=pPeriodid);

  RETURN pPeriodid;

END;
' LANGUAGE 'plpgsql';

