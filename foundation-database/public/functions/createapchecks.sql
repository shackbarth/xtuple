CREATE OR REPLACE FUNCTION createAPChecks(INTEGER, DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RAISE NOTICE 'createAPChecks() is deprecated - use createChecks() instead';
  RETURN createChecks($1, $2);
END;
$$ LANGUAGE 'plpgsql';
