
CREATE OR REPLACE FUNCTION attachContact(INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pcntctId    ALIAS FOR $1;
  pcrmacctId  ALIAS FOR $2;
BEGIN
  UPDATE cntct SET cntct_crmacct_id = pcrmacctId
  WHERE cntct_id = pcntctId;

  RETURN 0;
END;
$$ LANGUAGE 'plpgsql';

