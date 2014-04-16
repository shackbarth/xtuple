-- calculate the change in value caused by exchange rate fluctuations.
-- we generally care about currency exchange gain/loss when adjusting the G/L,
-- so this function returns its result in the base currency.
-- however, we only care about fluctuations in the base value of a foreign
-- quantity, so this function expects pValue ($3) in the local currency.
-- negative values = a loss.
CREATE OR REPLACE FUNCTION apcurrGain(INTEGER, INTEGER, NUMERIC, DATE)
RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pApopenId ALIAS FOR $1;
  pCurrId ALIAS FOR $2;
  pValue ALIAS FOR $3;
  pDate ALIAS FOR $4;
  _start DATE;
  _end DATE;
  _gain NUMERIC;
  _r RECORD;

BEGIN
  IF (pApopenId IS NULL OR pValue = 0) THEN
    RETURN 0;
  END IF;

  SELECT apopen_docdate, apopen_curr_rate
    INTO _r
  FROM apopen
  WHERE (apopen_id=pApopenId);

  IF (_r.apopen_docdate > pDate) THEN
    _gain := (currToBase(pCurrId, pValue, pDate) - (pValue / _r.apopen_curr_rate)) * -1;
  ELSE
    _gain := (pValue / _r.apopen_curr_rate) - currToBase(pCurrId, pValue, pDate);
  END IF;
  
  IF (_gain IS NULL) THEN
    RAISE EXCEPTION 'Error processing currency gain/loss.';
  END IF;

  RETURN _gain;
END;
$$ LANGUAGE plpgsql;
