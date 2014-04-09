CREATE OR REPLACE FUNCTION _contrctAfterTrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

BEGIN

  -- synchronize contract effectivity with item source effectivity
  IF (NEW.contrct_effective <> OLD.contrct_effective) THEN
    UPDATE itemsrc SET itemsrc_effective=NEW.contrct_effective
    WHERE itemsrc_contrct_id=NEW.contrct_id;
  END IF;

  IF (NEW.contrct_expires <> OLD.contrct_expires) THEN
    UPDATE itemsrc SET itemsrc_expires=NEW.contrct_expires
    WHERE itemsrc_contrct_id=NEW.contrct_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'contrctAfterTrigger');
CREATE TRIGGER contrctAfterTrigger AFTER UPDATE
ON contrct
FOR EACH ROW
EXECUTE PROCEDURE _contrctAfterTrigger();
