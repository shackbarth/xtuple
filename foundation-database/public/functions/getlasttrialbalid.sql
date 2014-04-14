
CREATE OR REPLACE FUNCTION getlasttrialbalid(INTEGER, INTEGER)
  RETURNS INTEGER STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pAccntId ALIAS FOR $1;
  pPeriodId ALIAS FOR $2;
  _p RECORD;
  _accntType TEXT;
  _result NUMERIC;

BEGIN

  SELECT period_end,period_yearperiod_id INTO _p
  FROM period
  WHERE period_id=pPeriodId;

  SELECT accnt_type INTO _accntType
  FROM accnt
  WHERE accnt_id=pAccntId;

  IF (_accntType IN ('R','E')) THEN
        SELECT trialbal_id INTO _result
        FROM trialbal
        WHERE ((trialbal_accnt_id=pAccntId)
        AND (trialbal_period_id=pPeriodId));
  ELSE
        SELECT trialbal_id INTO _result
        FROM (SELECT trialbal_id
                FROM trialbal,period
                WHERE ((trialbal_accnt_id=pAccntId)
                AND (trialbal_period_id=period_id)
                AND (period_end <= _p.period_end)
                AND (period_yearperiod_id=_p.period_yearperiod_id))
                ORDER BY period_end DESC) AS data;
  END IF;

  RETURN _result;

END;
$$ LANGUAGE 'plpgsql';

