CREATE OR REPLACE FUNCTION replaceAllVoidedChecks(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pBankaccntid	ALIAS FOR $1;
  _returnValue	INTEGER := 0;

BEGIN

  SELECT MIN(replaceVoidedCheck(checkhead_id)) INTO _returnValue
    FROM checkhead
    WHERE ( (checkhead_void)
     AND (NOT checkhead_posted)
     AND (NOT checkhead_replaced)
     AND (NOT checkhead_deleted)
     AND (checkhead_bankaccnt_id=pBankaccntid) );

  RETURN _returnValue;

END;
' LANGUAGE 'plpgsql';
