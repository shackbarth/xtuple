
CREATE OR REPLACE FUNCTION detachContact(INTEGER, INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pcntctId    ALIAS FOR $1;
  pcrmacctId  ALIAS FOR $2;
BEGIN
  UPDATE cntct SET cntct_crmacct_id = NULL
  WHERE cntct_id = pcntctId
    AND cntct_crmacct_id = pcrmacctId;

  UPDATE crmacct SET crmacct_cntct_id_1 = NULL
  WHERE crmacct_id = pcrmacctId
    AND crmacct_cntct_id_1 = pcntctId;

  UPDATE crmacct SET crmacct_cntct_id_2 = NULL
  WHERE crmacct_id = pcrmacctId
    AND crmacct_cntct_id_2 = pcntctId;

  RETURN 0;
END;
' LANGUAGE 'plpgsql';

