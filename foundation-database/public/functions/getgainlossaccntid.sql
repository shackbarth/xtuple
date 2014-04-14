
CREATE OR REPLACE FUNCTION getGainLossAccntId(integer) RETURNS INTEGER STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pAccntId ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF ( (pAccntId = 0) OR (pAccntId IS NULL) ) THEN
	RETURN 0;
  END IF;

  IF (fetchMetricValue('GLCompanySize') = 0) THEN
    _returnVal := fetchMetricValue('CurrencyGainLossAccount')::integer;
  ELSE
    SELECT company_gainloss_accnt_id INTO _returnVal
    FROM company
      JOIN accnt ON (company_number=accnt_company)
    WHERE (accnt_id=pAccntId);
  END IF;

  IF (_returnVal IS NULL) THEN
    RAISE EXCEPTION 'Currency Gain/Loss Account not found for %', formatGlAccountLong(pAccntId);
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';

