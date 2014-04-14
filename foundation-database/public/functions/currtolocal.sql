-- for currToLocal, currToBase, and currToCurr:
-- the curr_rate column has one more digit of precision than the user typed
-- in so if the metric CurrencyExchangeSense says to show rates as
-- foreign * rate = base, we can show what the user typed without rounding
-- loss. now we have to use the same rate the user sees, so round the
-- curr_rate.  see mantis #3901.

CREATE OR REPLACE FUNCTION currToLocal (integer, numeric, date) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
    pId     ALIAS FOR $1;
    pValue  ALIAS FOR $2;
    _date   DATE;
    _output NUMERIC;
BEGIN
    _date := $3;
    IF _date IS NULL THEN
        _date := 'now';
    END IF;

    IF pValue = 0 OR pValue IS NULL THEN
        _output := 0;
    ELSIF (baseCurrId() = pId) THEN
      _output := pValue;
    ELSE
        SELECT pValue * curr_rate
            INTO  _output
            FROM  curr_rate
            WHERE curr_id = pId
              AND _date BETWEEN curr_effective AND curr_expires;
        IF (_output IS NULL OR NOT FOUND) THEN
          RAISE EXCEPTION 'No exchange rate for % on %', pId, _date;
        END IF;
    END IF;
    RETURN _output;
END;
$$ LANGUAGE plpgsql;
