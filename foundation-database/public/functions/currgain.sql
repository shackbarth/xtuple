-- calculate the change in value caused by exchange rate fluctuations.
-- we generally care about currency exchange gain/loss when adjusting the G/L,
-- so this function returns its result in the base currency.
-- however, we only care about fluctuations in the base value of a foreign
-- quantity, so this function expects pValue ($2) in the local currency.
-- negative values = a loss.
CREATE OR REPLACE FUNCTION currGain(INTEGER, NUMERIC, DATE, DATE)
RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pId ALIAS FOR $1;
  pValue ALIAS FOR $2;
  pStart ALIAS FOR $3;
  pEnd ALIAS FOR $4;
  _start DATE;
  _end DATE;
  _gain NUMERIC;
  _multiplier	INTEGER	:= 1;

BEGIN
  IF (pEnd = pStart OR pValue = 0) THEN
    RETURN 0;
  END IF;

  IF (pStart > pEnd) THEN
    _start := pEnd;
    _end   := pStart;
    _multiplier := -1;
  ELSE
    _start := pStart;
    _end := pEnd;
  END IF;

  _gain := currToBase(pId, pValue, _start) - currToBase(pId, pValue, _end);
  IF (_gain IS NULL) THEN
    RAISE EXCEPTION 'Missing exchange rate for curr_id % on % or %',
                    pId, _start, _end;
  END IF;

  RETURN _gain * _multiplier;
END;
$$ LANGUAGE plpgsql;
