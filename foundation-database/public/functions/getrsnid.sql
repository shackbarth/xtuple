CREATE OR REPLACE FUNCTION getRsnId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pRsnCode ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pRsnCode IS NULL) THEN
    RETURN NULL;
  END IF;

  SELECT rsncode_id INTO _returnVal
  FROM rsncode
  WHERE (rsncode_code=pRsnCode);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Reason Code % not found.'', pRsnCode;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
