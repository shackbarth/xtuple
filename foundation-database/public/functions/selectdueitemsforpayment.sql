CREATE OR REPLACE FUNCTION selectDueItemsForPayment(INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pVendid ALIAS FOR $1;
  pBankaccntid ALIAS FOR $2;
  _currid INTEGER;

BEGIN

  SELECT bankaccnt_curr_id INTO _currid
  FROM bankaccnt
  WHERE (bankaccnt_id=pBankaccntid);

  PERFORM selectPayment(apopen_id, pBankaccntid)
     FROM apopen
    WHERE((apopen_open)
      AND (apopen_vend_id=pVendid)
      AND (apopen_duedate <= CURRENT_DATE)
      AND (apopen_status = 'O')
      AND (apopen_doctype IN ('V', 'D'))
      AND (apopen_curr_id=_currid) );

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
