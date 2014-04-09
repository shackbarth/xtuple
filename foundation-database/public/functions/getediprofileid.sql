
CREATE OR REPLACE FUNCTION getEdiProfileId(text) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pEdiProfileName ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pEdiProfileName IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT pkghead_id INTO _returnVal
    FROM pkghead
   WHERE(pkghead_name='xtbatch');
  IF(NOT FOUND) THEN
    RETURN NULL;
  END IF;

  SELECT ediprofile_id INTO _returnVal
  FROM xtbatch.ediprofile
  WHERE (ediprofile_name=pEdiProfileName);

  IF (_returnVal IS NULL) THEN
    RAISE EXCEPTION 'EDI Profile % not found.', pEdiProfileName;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';

