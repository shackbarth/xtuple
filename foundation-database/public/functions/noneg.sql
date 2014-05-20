
CREATE OR REPLACE FUNCTION noNeg(NUMERIC) RETURNS NUMERIC IMMUTABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pValue ALIAS FOR $1;

BEGIN

  IF (pValue < 0) THEN
    RETURN 0;
  ELSE
   RETURN pValue;
  END IF;

END;
' LANGUAGE 'plpgsql';

