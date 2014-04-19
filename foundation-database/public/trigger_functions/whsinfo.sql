CREATE OR REPLACE FUNCTION _warehousTrigger () RETURNS TRIGGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _cmnttypeid INTEGER;
  _check      BOOLEAN;
  _checkId    INTEGER;

BEGIN

  -- Checks
  -- Start with privileges
  IF (TG_OP = ''INSERT'') THEN
    SELECT checkPrivilege(''MaintainWarehouses'') INTO _check;
    IF NOT (_check) THEN
      RAISE EXCEPTION ''You do not have privileges to add new Sites.'';
    END IF;
  ELSE
    SELECT checkPrivilege(''MaintainWarehouses'') OR checkPrivilege(''IssueCountTags'') INTO _check;
    IF NOT (_check) THEN
      RAISE EXCEPTION ''You do not have privileges to alter a Site.'';
    END IF;
  END IF;

  -- Code is required
  IF (LENGTH(COALESCE(NEW.warehous_code,''''))=0) THEN
    RAISE EXCEPTION ''You must supply a valid Site Code.'';
  END IF;

  -- Sitetype is required
  IF (NEW.warehous_sitetype_id IS NULL) THEN
    RAISE EXCEPTION ''You must supply a valid Site Type.'';
  END IF;

  -- Cost Category is required for Transit types
  IF ((NEW.warehous_transit) AND (NEW.warehous_costcat_id IS NULL)) THEN
    RAISE EXCEPTION ''You must supply a valid Cost Category for Transit Sites.'';
  END IF;

  -- Code must be unique
  SELECT warehous_id INTO _checkId
  FROM whsinfo
  WHERE ( (UPPER(warehous_code)=UPPER(NEW.warehous_code))
    AND   (warehous_id<>NEW.warehous_id) );
  IF (FOUND) THEN
    RAISE EXCEPTION ''You must supply a unique Site Code.'';
  END IF;

  -- Count Tag Prefix must be unique
  IF (TG_OP = ''INSERT'') THEN
    SELECT warehous_id INTO _checkId
    FROM whsinfo
    WHERE (warehous_counttag_prefix=NEW.warehous_counttag_prefix);
  ELSE
    SELECT warehous_id INTO _checkId
    FROM whsinfo
    WHERE ( (warehous_counttag_prefix=NEW.warehous_counttag_prefix)
      AND   (warehous_id<>NEW.warehous_id) );
  END IF;
  IF (FOUND) THEN
    RAISE EXCEPTION ''You must supply a unique Count Tag Prefix.'';
  END IF;

  -- Check Complete
  -- Change Log
  IF ( SELECT (metric_value=''t'')
       FROM metric
       WHERE (metric_name=''WarehouseChangeLog'') ) THEN

--  Cache the cmnttype_id for ChangeLog
    SELECT cmnttype_id INTO _cmnttypeid
    FROM cmnttype
    WHERE (cmnttype_name=''ChangeLog'');
    IF (FOUND) THEN
      IF (TG_OP = ''INSERT'') THEN
        PERFORM postComment(_cmnttypeid, ''WH'', NEW.warehous_id, ''Created'');

      ELSIF (TG_OP = ''UPDATE'') THEN
        IF (OLD.warehous_code <> NEW.warehous_code) THEN
          PERFORM postComment( _cmnttypeid, ''WH'', NEW.warehous_id,
                               (''Code Changed from "'' || OLD.warehous_code || ''" to "'' || NEW.warehous_code || ''"'') );
        END IF;

        IF (OLD.warehous_descrip <> NEW.warehous_descrip) THEN
          PERFORM postComment( _cmnttypeid, ''WH'', NEW.warehous_id,
                               ( ''Description Changed from "'' || OLD.warehous_descrip ||
                                 ''" to "'' || NEW.warehous_descrip || ''"'' ) );
        END IF;

        IF (OLD.warehous_active <> NEW.warehous_active) THEN
          IF (NEW.warehous_active) THEN
            PERFORM postComment(_cmnttypeid, ''WH'', NEW.warehous_id, ''Activated'');
          ELSE
            PERFORM postComment(_cmnttypeid, ''WH'', NEW.warehous_id, ''Deactivated'');
          END IF;
        END IF;

      END IF;
    END IF;
  END IF;

  RETURN NEW;

END;
' LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS warehousTrigger ON whsinfo;
CREATE TRIGGER warehousTrigger BEFORE INSERT OR UPDATE ON whsinfo FOR EACH ROW EXECUTE PROCEDURE _warehousTrigger();
