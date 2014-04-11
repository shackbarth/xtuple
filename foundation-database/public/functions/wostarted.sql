CREATE OR REPLACE FUNCTION wostarted(pWoid INTEGER) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _result BOOLEAN := FALSE;
   
BEGIN   
  -- is it really this simple?
  SELECT (wo_wipvalue > 0) INTO _result
    FROM wo
   WHERE wo_id=pWoid;
  
  RETURN COALESCE(_result, FALSE);
END;
$$ LANGUAGE 'plpgsql';
