CREATE OR REPLACE FUNCTION currentNumber(TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pName   ALIAS FOR $1;
  _number INTEGER;

BEGIN
  SELECT orderseq_number INTO _number
  FROM orderseq
  WHERE (orderseq_name=pName);
  IF (NOT FOUND) THEN
    _number := 0;
  END IF;

  RETURN _number;

END;
$$ LANGUAGE 'plpgsql';
