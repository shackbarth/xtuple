
CREATE OR REPLACE FUNCTION formatGLAccount(INTEGER) RETURNS TEXT IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pAccntid ALIAS FOR $1;
  _accnt RECORD;

BEGIN

  SELECT COALESCE(accnt_company, '') AS accnt_company,
         COALESCE(accnt_profit, '') AS accnt_profit,
         accnt_number,
         COALESCE(accnt_sub, '') AS accnt_sub INTO _accnt
  FROM accnt
  WHERE (accnt_id=pAccntid);

  IF (NOT FOUND) THEN
    RETURN 'Error';
  END IF;

  RETURN formatGlAccount(_accnt.accnt_company, _accnt.accnt_profit, _accnt.accnt_number, _accnt.accnt_sub);

END;
$$	 LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION formatGLAccount(TEXT, TEXT, TEXT, TEXT) RETURNS TEXT IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCompany ALIAS FOR $1;
  pProfit ALIAS FOR $2;
  pNumber ALIAS FOR $3;
  pSub    ALIAS FOR $4;
  _number TEXT := '';

BEGIN

  IF ( ( SELECT metric_value::INTEGER
         FROM metric
         WHERE (metric_name='GLCompanySize') ) > 0 ) THEN
    _number := pCompany || '-';
  END IF;

  IF ( ( SELECT metric_value::INTEGER
         FROM metric
         WHERE (metric_name='GLProfitSize') ) > 0 ) THEN
    _number := _number || pProfit || '-';
  END IF;

  _number := _number || pNumber;

  IF ( ( SELECT metric_value::INTEGER
         FROM metric
         WHERE (metric_name='GLSubaccountSize') ) > 0 ) THEN
    _number := _number || '-' || pSub;
  END IF;

  RETURN _number;

END;
$$	 LANGUAGE 'plpgsql';

