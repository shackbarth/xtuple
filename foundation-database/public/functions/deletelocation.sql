CREATE OR REPLACE FUNCTION deleteLocation(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pLocationid ALIAS FOR $1;
  _check INTEGER;

BEGIN

--  Check to see if any itemsite used the passed location as their default
  SELECT itemsite_id INTO _check
  FROM itemsite
  WHERE (itemsite_location_id=pLocationid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -1;
  END IF;

--  Check to see if any inventory is currently stored at the passed location
  SELECT itemloc_id INTO _check
  FROM itemloc
  WHERE (itemloc_location_id=pLocationid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -2;
  END IF;

--  Check to see if any undistributed inventory transactions are currently posted at the passed location
  SELECT itemlocdist_id INTO _check
  FROM itemlocdist
  WHERE ( (itemlocdist_source_type=''L'')
  AND (itemlocdist_source_id=pLocationid) )
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -3;
  END IF;

--  Check to see if the passed location has any Inventory Detail posted against it
  SELECT invdetail_id INTO _check
  FROM invdetail
  WHERE (invdetail_location_id=pLocationid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -4;
  END IF;

--  Delete any associated locitem records
  DELETE FROM locitem
  WHERE (locitem_location_id=pLocationid);

--  Delete the location record
  DELETE FROM location
  WHERE (location_id=pLocationid);

  RETURN pLocationid;

END;
' LANGUAGE 'plpgsql';
