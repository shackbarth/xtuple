CREATE OR REPLACE FUNCTION postCCVoid(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pccpayid ALIAS FOR $1;

BEGIN
  -- for now this is very simple: mark the ccpay record voided.
  -- in the future this might be expanded to back out changes to other tables
  -- but for now the VOID request is sent to the credit card processing company
  -- before those other tables are modified.

  UPDATE ccpay SET ccpay_status = ''V'' WHERE (ccpay_id=pccpayid);

  IF (NOT FOUND) THEN
    RETURN -1;
  END IF;

  RETURN 0;

END;
'
  LANGUAGE 'plpgsql';
