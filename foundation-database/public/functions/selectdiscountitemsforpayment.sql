CREATE OR REPLACE FUNCTION selectDiscountItemsForPayment(INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pVendid ALIAS FOR $1;
  pBankaccntid ALIAS FOR $2;
  _currid INTEGER;
  _r RECORD;

BEGIN

  SELECT bankaccnt_curr_id INTO _currid
  FROM bankaccnt
  WHERE (bankaccnt_id=pBankaccntid);

  FOR _r IN SELECT apopen_id
              FROM apopen, terms
             WHERE((CURRENT_DATE <= determineDiscountDate(apopen_terms_id, apopen_docdate))
               AND (terms_discprcnt > 0.0)
               AND (apopen_terms_id=terms_id)
               AND (apopen_open)
               AND (apopen_status = 'O')
               AND (apopen_doctype IN ('V', 'D'))
               AND (apopen_vend_id=pVendid)
               AND (apopen_curr_id=_currid) ) LOOP
    PERFORM selectPayment(_r.apopen_id, pBankaccntid);
  END LOOP;

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
