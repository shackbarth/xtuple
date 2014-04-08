
CREATE OR REPLACE FUNCTION setNextCheckNumber(INTEGER, INTEGER) RETURNS BOOLEAN AS '
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pBankaccntid ALIAS FOR $1;
  pNextCheckNumber ALIAS FOR $2;

BEGIN

  UPDATE bankaccnt
  SET bankaccnt_nextchknum=pNextCheckNumber
  WHERE (bankaccnt_id=pBankaccntid);

  RETURN TRUE;

END;
' LANGUAGE 'plpgsql';

