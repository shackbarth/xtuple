CREATE OR REPLACE FUNCTION getCntctId(pContactNumber text) RETURNS INTEGER STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
BEGIN
  SELECT getCntctId(pContactNumber,true) INTO _returnVal;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION getCntctId(pContactNumber text,
                                      pNotFoundErr boolean) RETURNS INTEGER STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
BEGIN
  IF (COALESCE(TRIM(pContactNumber), '') = '') THEN
    RETURN NULL;
  END IF;

  SELECT cntct_id INTO _returnVal
  FROM cntct
  WHERE (cntct_number=pContactNumber);

  IF (_returnVal IS NULL AND pNotFoundErr) THEN
    RAISE EXCEPTION 'Contact Number % not found.', pContactNumber;
  ELSIF (_returnVal IS NULL) THEN
    RETURN NULL;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
