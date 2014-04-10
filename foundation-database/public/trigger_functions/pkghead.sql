SELECT dropIfExists('TRIGGER', 'pkgheadbeforetrigger');
CREATE OR REPLACE FUNCTION _pkgheadbeforetrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
  DECLARE
    _r    RECORD;

  BEGIN
    IF (TG_OP = 'UPDATE') THEN
      NEW.pkghead_created := OLD.pkghead_created;
      NEW.pkghead_updated := CURRENT_TIMESTAMP;
      IF (NEW.pkghead_indev AND NOT userCanCreateUsers(getEffectiveXtUser())) THEN
        NEW.pkghead_indev = FALSE;
      END IF;

    ELSIF (TG_OP = 'INSERT') THEN
      NEW.pkghead_created := CURRENT_TIMESTAMP;
      NEW.pkghead_updated := NEW.pkghead_created;
      IF (NEW.pkghead_indev AND NOT userCanCreateUsers(getEffectiveXtUser())) THEN
        NEW.pkghead_indev = FALSE;
      END IF;

    ELSIF (TG_OP = 'DELETE') THEN
      DELETE FROM pkgdep WHERE pkgdep_pkghead_id=OLD.pkghead_id;

      EXECUTE 'DROP SCHEMA ' || OLD.pkghead_name || ' CASCADE';

      RETURN OLD;
    END IF;

    RETURN NEW;
  END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER pkgheadbeforetrigger
  BEFORE  INSERT OR
	  UPDATE OR
          DELETE
  ON pkghead
  FOR EACH ROW
  EXECUTE PROCEDURE _pkgheadbeforetrigger();
