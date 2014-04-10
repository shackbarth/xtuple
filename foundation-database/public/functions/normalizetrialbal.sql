
CREATE OR REPLACE FUNCTION normalizeTrialBal(INTEGER, CHARACTER(1)) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pTrialbalid ALIAS FOR $1;
  pSide ALIAS FOR $2;
  _value NUMERIC;
  _r RECORD;

BEGIN

  SELECT accnt_type, trialbal_beginning, trialbal_ending INTO _r
  FROM trialbal, accnt
  WHERE ( (trialbal_accnt_id=accnt_id)
   AND (trialbal_id=pTrialbalid) );
  IF (NOT FOUND) THEN
    RETURN -1;
  END IF;

-- If we are looking for the Ending Balance, cache it
  IF (pSide = 'E') THEN
    _value = _r.trialbal_ending;

--  We had better been looking for the Beginning Balance!
  ELSE
    _value = _r.trialbal_beginning;
  END IF;

--  If the accnt_type is Asset or Expense, swap the sense
  IF (_r.accnt_type IN ('A', 'E')) THEN
    _value := (_value * -1);
  END IF;

  RETURN _value;

END;
$$ LANGUAGE 'plpgsql';

