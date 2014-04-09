
CREATE OR REPLACE FUNCTION roundUp(NUMERIC) RETURNS NUMERIC IMMUTABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

  pValue ALIAS FOR $1;
  _checkValue integer;

BEGIN

  _checkValue := pValue::integer;

  IF (_checkValue::numeric < pValue) THEN
    RETURN (_checkValue + 1)::numeric;
  ELSE
    RETURN _checkValue::numeric;
  END IF;

END;
' LANGUAGE 'plpgsql';

