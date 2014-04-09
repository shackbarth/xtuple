CREATE OR REPLACE FUNCTION saveImageAss(TEXT, INTEGER, CHAR, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSource 	ALIAS FOR $1;
  pSourceId 	ALIAS FOR $2;
  pPurpose 	ALIAS FOR $3;
  pImageid 	ALIAS FOR $4;
  _imageassId INTEGER = 0;

BEGIN

--  See if this link already exists
  SELECT imageass_id INTO _imageassId
  FROM imageass
  WHERE ((imageass_source_id=pSourceId)
  AND (imageass_source=pSource)
  AND (imageass_image_id=pImageId)
  AND (imageass_purpose=pPurpose));

  IF (FOUND) THEN
    RETURN _imageassId;
  END IF;
  
-- See if a record with this purpose already exists (item only)
  IF (pSource = 'I' AND pPurpose != 'M') THEN
    SELECT imageass_id INTO _imageassId
    FROM imageass
    WHERE ((imageass_source_id=pSourceId)
    AND (imageass_source=pSource)
    AND (imageass_purpose=pPurpose));
  END IF;

  IF (_imageassId > 0) THEN
    UPDATE imageass SET
      imageass_image_id=pImageId
    WHERE (imageass_id=_imageassId);
  ELSE
    _imageassId := NEXTVAL('imageass_imageass_id_seq');
    INSERT INTO imageass VALUES (_imageassId,pSourceId,pSource,pImageid,CASE WHEN pSource='I' THEN pPurpose ELSE 'M' END);
  END IF;
  
  RETURN _imageassId;
END;
$$ LANGUAGE 'plpgsql';
