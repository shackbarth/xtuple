CREATE OR REPLACE FUNCTION saveItemImage(INTEGER, CHAR, INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pPurpose ALIAS FOR $2;
  pImageid ALIAS FOR $3;
  _itemimageId INTEGER;

BEGIN
-- See if a record with this purpose already exists
  SELECT imageass_id INTO _itemimageId
  FROM imageass
  WHERE ( (imageass_source=''I'')
    AND   (imageass_source_id=pItemid)
    AND   (imageass_purpose=pPurpose) );

  IF (FOUND) THEN
    UPDATE imageass SET imageass_image_id=pImageId
    WHERE (imageass_id=_itemimageId);
  ELSE
    _itemimageId := NEXTVAL(''imageass_imageass_id_seq'');
    INSERT INTO imageass VALUES (_itemimageId,pItemid,''I'',pImageid,pPurpose);
  END IF;
  
  RETURN _itemimageId;
END;
' LANGUAGE 'plpgsql';
