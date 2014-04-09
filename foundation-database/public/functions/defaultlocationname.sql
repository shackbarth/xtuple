CREATE OR REPLACE FUNCTION defaultLocationName(INTEGER) RETURNS TEXT AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  _p RECORD;

BEGIN

  SELECT itemsite_location_id, itemsite_location INTO _p
  FROM itemsite
  WHERE (itemsite_id=pItemsiteid);

  IF (NOT FOUND) THEN
    RETURN ''Error'';
  ELSIF (_p.itemsite_location_id = -1) THEN
    RETURN _p.itemsite_location;
  ELSE
    RETURN formatLocationName(_p.itemsite_location_id);
  END IF;

END;
' LANGUAGE 'plpgsql';
