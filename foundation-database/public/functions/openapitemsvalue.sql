CREATE OR REPLACE FUNCTION openAPItemsValue(pVendid    INTEGER,
                                            pPeriodid  INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _value NUMERIC;

BEGIN

  SELECT SUM( (apopen_amount - apopen_paid) / apopen_curr_rate *
               CASE WHEN (apopen_doctype IN ('D', 'V')) THEN 1 ELSE -1 END )
               INTO _value
  FROM apopen
  WHERE ( (apopen_open)
    AND   (apopen_vend_id=pVendid)
    AND   (apopen_duedate BETWEEN findPeriodStart(pPeriodid) AND findPeriodEnd(pPeriodid)) );

  RETURN COALESCE(_value, 0.0);

END;
$$ LANGUAGE 'plpgsql';
