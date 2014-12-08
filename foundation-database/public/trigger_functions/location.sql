CREATE OR REPLACE FUNCTION _locationTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _check      BOOLEAN;
  _checkId    INTEGER;

BEGIN

  -- Checks
  -- Start with privileges
  IF (TG_OP = 'INSERT') THEN
    SELECT checkPrivilege('MaintainLocations') INTO _check;
    IF NOT (_check) THEN
      RAISE EXCEPTION 'You do not have privileges to add new Locations.';
    END IF;
  ELSE
    SELECT checkPrivilege('MaintainLocations') INTO _check;
    IF NOT (_check) THEN
      RAISE EXCEPTION 'You do not have privileges to alter a Location.';
    END IF;
  END IF;

  -- Code is required
  IF ( (LENGTH(COALESCE(NEW.location_name,''))=0) AND
       (LENGTH(COALESCE(NEW.location_aisle,''))=0) AND
       (LENGTH(COALESCE(NEW.location_rack,''))=0) AND
       (LENGTH(COALESCE(NEW.location_bin,''))=0) ) THEN
    RAISE EXCEPTION 'You must supply a valid Location Identifier.';
  END IF;
  
  -- Site is required
  IF (NEW.location_warehous_id IS NULL) THEN
    RAISE EXCEPTION 'You must supply a valid Site.';
  END IF;

  -- Location Identifier must be unique
  SELECT location_id INTO _checkId
  FROM location
  WHERE ( (UPPER(location_name)=UPPER(NEW.location_name))
    AND   (UPPER(location_aisle)=UPPER(NEW.location_aisle))
    AND   (UPPER(location_rack)=UPPER(NEW.location_rack))
    AND   (UPPER(location_bin)=UPPER(NEW.location_bin))
    AND   (location_warehous_id=NEW.location_warehous_id)
    AND   (location_id<>NEW.location_id) );
  IF (FOUND) THEN
    RAISE EXCEPTION 'You must supply a unique Location Identifier for this Site.';
  END IF;

  -- Populate formatted name
  IF (NEW.location_aisle IS NOT NULL) THEN
    NEW.location_formatname := NEW.location_aisle;
  ELSE
    NEW.location_formatname := '';
  END IF;

  IF (NEW.location_rack IS NOT NULL) THEN
    NEW.location_formatname := (NEW.location_formatname || NEW.location_rack);
  END IF;

  IF (NEW.location_bin IS NOT NULL) THEN
    NEW.location_formatname := (NEW.location_formatname || NEW.location_bin);
  END IF;

  IF (NEW.location_name IS NOT NULL) THEN
    NEW.location_formatname := (NEW.location_formatname || NEW.location_name);
  END IF;
  
  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'locationTrigger');
CREATE TRIGGER locationTrigger BEFORE INSERT OR UPDATE ON location FOR EACH ROW EXECUTE PROCEDURE _locationTrigger();

CREATE OR REPLACE FUNCTION _locationAfterTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _itemloc    RECORD;

BEGIN

  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'locationAfterTrigger');
CREATE TRIGGER locationAfterTrigger AFTER INSERT OR UPDATE ON location FOR EACH ROW EXECUTE PROCEDURE _locationAfterTrigger();

