CREATE OR REPLACE FUNCTION validLocation(INTEGER, INTEGER) RETURNS BOOLEAN AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pLocationid ALIAS FOR $1;
  pItemsiteid ALIAS FOR $2;
  _p RECORD;
  
BEGIN

  SELECT location_restrict INTO _p
  FROM location, itemsite
  WHERE ( (location_warehous_id=itemsite_warehous_id)
    AND (itemsite_id=pItemsiteid)
    AND (location_id=pLocationid) );

  IF (FOUND) THEN
    IF (_p.location_restrict) THEN

      SELECT locitem_id INTO _p
      FROM locitem, itemsite
      WHERE ( (locitem_item_id=itemsite_item_id)
       AND (itemsite_id=pItemsiteid)
       AND (locitem_location_id=pLocationid) );

      IF (FOUND) THEN
        RETURN TRUE;
      END IF;

    ELSE
      RETURN TRUE;
    END IF;

  ELSE
    RETURN FALSE;
  END IF;

  RETURN FALSE;

END;
' LANGUAGE 'plpgsql';

-- i found the following in a different batch script than the version above.
-- i like the second version better but the 1st is the one that was in dev
-- at the time i did the split so it''s most likely the one that we have been
-- testing.
-- TODO: uncomment the following and test it. if it works, drop the one above
-- CREATE OR REPLACE FUNCTION validLocation(INTEGER, INTEGER) RETURNS BOOLEAN AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
-- DECLARE
--   pLocationid ALIAS FOR $1;
--   pItemsiteid ALIAS FOR $2;
--   _valid BOOLEAN;
--   _check INTEGER;
-- 
-- BEGIN
-- 
-- --  Check to see if the passed location is even restricted
--   SELECT (NOT(location_restrict)) INTO _valid
--   FROM location, itemsite
--   WHERE ( (location_warehous_id=itemsite_warehous_id)
--     AND (location_id=pLocationid)
--     AND (itemsite_id=pItemsiteid) );
--   IF ( (FOUND) AND (_valid) ) THEN
--     RETURN TRUE;
--   END IF;
-- 
-- --  Check to see if the passed itemsite_id is allowed in the passed restricted location_id
--   SELECT location_id INTO _check
--   FROM location, locitem, itemsite
--   WHERE ( (locitem_location_id=location_id)
--    AND (locitem_item_id=itemsite_item_id)
--    AND (location_warehous_id=itemsite_warehous_id)
--    AND (location_id=pLocationid)
--    AND (itemsite_id=pItemsiteid) );
--   IF (FOUND) THEN
--     RETURN TRUE;
--   END IF;
-- 
--   RETURN FALSE;
-- 
-- END;
-- ' LANGUAGE 'plpgsql';
