-- calculate the change in value caused by exchange rate fluctuations.
-- we generally care about currency exchange gain/loss when adjusting the G/L,
-- so this function returns its result in the base currency.
-- however, we only care about fluctuations in the base value of a foreign
-- quantity, so this function expects pValue ($3) in the local currency.
-- negative values = a loss.
CREATE OR REPLACE FUNCTION arcurrGain(INTEGER, INTEGER, NUMERIC, DATE)
RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pAropenId ALIAS FOR $1;
  pCurrId ALIAS FOR $2;
  pValue ALIAS FOR $3;
  pDate ALIAS FOR $4;
  _start DATE;
  _end DATE;
  _gain NUMERIC;
  _r RECORD;

BEGIN
  IF (pAropenId IS NULL OR pValue = 0) THEN
    RETURN 0;
  END IF;

  SELECT aropen_docdate, aropen_curr_id, aropen_curr_rate
    INTO _r
  FROM aropen
  WHERE (aropen_id=pAropenId);

  IF (_r.aropen_docdate > pDate) THEN
    _gain := (currToBase(pCurrId, pValue, pDate) - currToCurr(pCurrId,_r.aropen_curr_id, pValue, pDate) / _r.aropen_curr_rate) * -1;
  ELSE
    _gain := currToCurr(pCurrId,_r.aropen_curr_id, pValue, pDate) / _r.aropen_curr_rate - currToBase(pCurrId, pValue, pDate);
  END IF;

  IF (_gain IS NULL) THEN
    RAISE EXCEPTION 'Error processing currency gain/loss.';
  END IF;

  RETURN _gain;
END;
$$ LANGUAGE plpgsql;
