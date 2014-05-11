CREATE OR REPLACE FUNCTION receipts(TEXT) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pTransType ALIAS FOR $1;

BEGIN
  IF (pTransType IN ('RM', 'RB', 'RT', 'RP', 'RR', 'RX', 'TR')) THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;

END;
$$ LANGUAGE 'plpgsql';
