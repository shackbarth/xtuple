CREATE OR REPLACE FUNCTION getSiteTypeId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSiteType ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pSiteType IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT sitetype_id INTO _returnVal
  FROM sitetype
  WHERE (sitetype_name=pSiteType);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Site Type % not found.'', pSiteType;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
