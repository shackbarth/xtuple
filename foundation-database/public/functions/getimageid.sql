CREATE OR REPLACE FUNCTION getImageId(pImageName text) RETURNS INTEGER STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
BEGIN
  IF (COALESCE(TRIM(pImageName), '') = '') THEN
    RETURN NULL;
  END IF;

  SELECT image_id INTO _returnVal
  FROM image
  WHERE (image_name=pImageName);

  IF (_returnVal IS NULL) THEN
    RAISE EXCEPTION 'Image % not found.', pImageName;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
