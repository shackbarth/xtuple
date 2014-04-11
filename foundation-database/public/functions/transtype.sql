CREATE OR REPLACE FUNCTION transType(TEXT, INTEGER) RETURNS BOOLEAN AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pTransType ALIAS FOR $1;
  pTargetType ALIAS FOR $2;

BEGIN

  IF (pTargetType = 255) THEN
    RETURN TRUE;
  ELSIF (pTargetType = 1) THEN
    RETURN receipts(pTransType);
  ELSIF (pTargetType = 2) THEN
    RETURN issues(pTransType);
  ELSIF (pTargetType = 4) THEN
    RETURN shipments(pTransType);
  ELSIF (pTargetType = 8) THEN
    RETURN adjustments(pTransType);
  ELSIF (pTargetType = 16) THEN
    RETURN transfers(pTransType);
  ELSIF (pTargetType = 32) THEN
    RETURN scraps(pTransType);
  ELSE
    RETURN TRUE;
  END IF;

END;
' LANGUAGE 'plpgsql';
