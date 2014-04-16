
CREATE OR REPLACE FUNCTION formatLocationName(INTEGER) RETURNS TEXT IMMUTABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pLocationid ALIAS FOR $1;
  _name TEXT;
  _r RECORD;

BEGIN

  SELECT location_aisle, location_rack,
         location_bin, location_name INTO _r
  FROM location
  WHERE (location_id=pLocationid);
  IF (FOUND) THEN
    IF (_r.location_aisle IS NOT NULL) THEN
      _name := _r.location_aisle;
    ELSE
      _name := '''';
    END IF;

    IF (_r.location_rack IS NOT NULL) THEN
      _name := (_name || _r.location_rack);
    END IF;

    IF (_r.location_bin IS NOT NULL) THEN
      _name := (_name || _r.location_bin);
    END IF;

    IF (_r.location_name IS NOT NULL) THEN
      _name := (_name || _r.location_name);
    END IF;

    RETURN _name;
  ELSE
    RETURN ''N/A'';
  END IF;

END;
' LANGUAGE 'plpgsql';

