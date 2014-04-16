
CREATE OR REPLACE FUNCTION toNumeric(TEXT, NUMERIC) RETURNS NUMERIC IMMUTABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pText ALIAS FOR $1;
  pDefault ALIAS FOR $2;

BEGIN

  IF (isNumeric(pText)) THEN
    RETURN TO_NUMBER(pText, ''999999999999'');
  ELSE
    RETURN pDefault;
  END IF;

END;
' LANGUAGE plpgsql;

