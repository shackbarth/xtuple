SELECT dropIfExists('FUNCTION', 'toggleBankrecCleared(int,text,int)', 'public');

CREATE OR REPLACE FUNCTION toggleBankrecCleared(pBankrecid INTEGER,
                                                pSource TEXT,
                                                pSourceid INTEGER,
                                                pCurrrate NUMERIC,
                                                pBaseAmount NUMERIC) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN toggleBankrecCleared(pBankrecid, pSource, pSourceid, pCurrrate, pBaseAmount, NULL);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION toggleBankrecCleared(pBankrecid INTEGER,
                                                pSource TEXT,
                                                pSourceid INTEGER,
                                                pCurrrate NUMERIC,
                                                pBaseAmount NUMERIC,
                                                pDate DATE) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _cleared BOOLEAN;
  _r RECORD;

BEGIN
  SELECT bankrecitem_id, bankrecitem_cleared INTO _r
    FROM bankrecitem
   WHERE ( (bankrecitem_bankrec_id=pBankrecid)
     AND   (bankrecitem_source=pSource)
     AND   (bankrecitem_source_id=pSourceid) );
  IF ( NOT FOUND ) THEN
    _cleared := TRUE;
    INSERT INTO bankrecitem
    (bankrecitem_bankrec_id, bankrecitem_source,
     bankrecitem_source_id, bankrecitem_cleared,
     bankrecitem_curr_rate, bankrecitem_amount,
     bankrecitem_effdate)
    VALUES
    (pBankrecid, pSource,
     pSourceid, _cleared,
     CASE WHEN (fetchMetricValue('CurrencyExchangeSense') = 1) THEN ROUND(1.0 / pCurrrate, 8)
          ELSE ROUND(pCurrrate,8) END,
     CASE WHEN (fetchMetricValue('CurrencyExchangeSense') = 1) THEN ROUND(pBaseAmount * ROUND(1.0 / pCurrrate,8),2)
          ELSE ROUND(pBaseAmount * ROUND(pCurrrate,8),2) END,
     pDate);
  ELSE
    _cleared := FALSE;
    DELETE FROM bankrecitem 
    WHERE bankrecitem_id = _r.bankrecitem_id;
  END IF;

  RETURN _cleared;
END;
$$ LANGUAGE plpgsql;

