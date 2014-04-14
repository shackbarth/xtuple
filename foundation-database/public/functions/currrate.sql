CREATE OR REPLACE FUNCTION currRate(INTEGER, DATE) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN currRate($1, NULL, $2);

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION currRate(pFromCurr INTEGER,
                                    pToCurr INTEGER,
                                    pDate DATE) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _fromRate NUMERIC := 1.0;
  _toRate NUMERIC := 1.0;
  _returnVal NUMERIC := 1.0;
BEGIN
  IF pFromCurr = pToCurr THEN
    RETURN _returnVal;
  END IF;

  IF (pFromCurr IS NOT NULL) THEN
    SELECT curr_rate INTO _fromRate
    FROM curr_rate
    WHERE ( (curr_id=pFromCurr)
    AND (pDate BETWEEN curr_effective AND curr_expires) );

    IF ( NOT FOUND) THEN
      RAISE EXCEPTION 'Currency exchange rate for currency % not found on %', pFromCurr, formatDate(pDate);
    END IF;
  END IF;

  IF (pToCurr IS NOT NULL) THEN
    SELECT curr_rate INTO _toRate
    FROM curr_rate
    WHERE ( (curr_id=pToCurr)
    AND (pDate BETWEEN curr_effective AND curr_expires) );

    IF ( NOT FOUND) THEN
      RAISE EXCEPTION 'Currency exchange rate for currency % not found on %', pToCurr, formatDate(pDate);
    END IF;
  END IF;

  _returnVal := _fromRate / _toRate;

  RETURN _returnVal;
END;
$$ LANGUAGE plpgsql;
