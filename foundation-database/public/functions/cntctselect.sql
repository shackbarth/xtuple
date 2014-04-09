CREATE OR REPLACE FUNCTION cntctselect(integer, boolean) RETURNS boolean AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCntctId ALIAS FOR $1;
  pTarget ALIAS FOR $2;

BEGIN
  -- If target, delete any other targets
  IF (pTarget) THEN
    DELETE FROM cntctsel WHERE cntctsel_target;
  END IF;
  
  -- Delete any previous selection of this contact
  DELETE FROM cntctsel WHERE cntctsel_cntct_id=pCntctId;

  -- Add this contact in appropriate selection state
  INSERT INTO cntctsel VALUES (pCntctId,pTarget);

  RETURN true;
END;
$$ LANGUAGE 'plpgsql';
