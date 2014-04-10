
CREATE OR REPLACE FUNCTION formatCreditMemoNumber(INTEGER) RETURNS TEXT IMMUTABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCmheadid ALIAS FOR $1;

BEGIN
  RETURN ( SELECT COALESCE(cmhead_number::TEXT, '''')
           FROM cmhead
           WHERE (cmhead_id=pCmheadid) );
END;
' LANGUAGE 'plpgsql';

