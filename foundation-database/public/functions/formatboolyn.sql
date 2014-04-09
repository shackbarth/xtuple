
CREATE OR REPLACE FUNCTION formatBoolYN(BOOLEAN) RETURNS TEXT IMMUTABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE pBool ALIAS FOR $1;
BEGIN
  IF (pBool) THEN
    RETURN ''Yes'';
  ELSE
    RETURN ''No'';
  END IF;
END;
' LANGUAGE 'plpgsql';

