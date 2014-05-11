-- for currToLocal, currToBase, and currToCurr:
-- the curr_rate column has one more digit of precision than the user typed
-- in so if the metric CurrencyExchangeSense says to show rates as
-- foreign * rate = base, we can show what the user typed without rounding
-- loss. now we have to use the same rate the user sees, so round the
-- curr_rate.  see mantis #3901.

CREATE OR REPLACE FUNCTION currToCurr(INTEGER, INTEGER, NUMERIC, DATE)
    RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pFromCurr ALIAS FOR $1;
  pToCurr ALIAS FOR $2;
  pValue   ALIAS FOR $3;
  pEffective ALIAS FOR $4;
  _convertedValue NUMERIC;
  _fromRate NUMERIC;
  _toRate NUMERIC;
BEGIN
  IF pFromCurr = pToCurr THEN
    RETURN pValue;
  END IF;

  IF pValue = 0 OR pValue IS NULL THEN
    RETURN 0;
  END IF;

  SELECT curr_rate INTO _fromRate
  FROM curr_rate
  WHERE curr_id = pFromCurr
    AND pEffective BETWEEN curr_effective AND curr_expires;

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'No exchange rate for % on %', pFromCurr, pEffective;
  END IF;

  SELECT curr_rate INTO _toRate
  FROM curr_rate
  WHERE curr_id = pToCurr
    AND pEffective BETWEEN curr_effective AND curr_expires;

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'No exchange rate for % on %', pToCurr, pEffective;
  END IF;

  _convertedValue := pValue * _toRate / _fromRate;

  RETURN _convertedValue;
END;
$$ LANGUAGE plpgsql;
