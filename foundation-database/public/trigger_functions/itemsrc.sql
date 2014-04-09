CREATE OR REPLACE FUNCTION _itemsrcTrigger () RETURNS TRIGGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

-- Privilege Checks
   IF (NOT checkPrivilege(''MaintainItemSources'')) THEN
     RAISE EXCEPTION ''You do not have privileges to maintain Item Sources.'';
   END IF;

-- Set defaults
   NEW.itemsrc_invvendoruomratio	:= COALESCE(NEW.itemsrc_invvendoruomratio,1);
   NEW.itemsrc_minordqty		:= COALESCE(NEW.itemsrc_minordqty,0);
   NEW.itemsrc_multordqty		:= COALESCE(NEW.itemsrc_multordqty,0);
   NEW.itemsrc_active			:= COALESCE(NEW.itemsrc_active,true);
   NEW.itemsrc_leadtime			:= COALESCE(NEW.itemsrc_leadtime,0);
   NEW.itemsrc_ranking			:= COALESCE(NEW.itemsrc_ranking,1);
  
  RETURN NEW;
END;
' LANGUAGE 'plpgsql';

SELECT dropifexists('TRIGGER', 'itemsrcTrigger');
CREATE TRIGGER itemsrcTrigger BEFORE INSERT OR UPDATE ON itemsrc FOR EACH ROW EXECUTE PROCEDURE _itemsrcTrigger();

CREATE OR REPLACE FUNCTION _itemsrcAfterTrigger () RETURNS TRIGGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

-- Privilege Checks
  IF (NOT checkPrivilege(''MaintainItemSources'')) THEN
    RAISE EXCEPTION ''You do not have privileges to maintain Item Sources.'';
  END IF;

-- Set default to false for other item sources of this item
  IF (COALESCE(NEW.itemsrc_default, FALSE) = TRUE) THEN
    UPDATE itemsrc SET itemsrc_default = FALSE
    WHERE ( (itemsrc_item_id = NEW.itemsrc_item_id)
      AND (itemsrc_id <> NEW.itemsrc_id) );
  END IF;

  RETURN NEW;
END;
' LANGUAGE 'plpgsql';

SELECT dropIfExists('trigger', 'itemsrcAfterTrigger');
CREATE TRIGGER itemsrcAfterTrigger AFTER INSERT OR UPDATE ON itemsrc FOR EACH ROW EXECUTE PROCEDURE _itemsrcAfterTrigger();
