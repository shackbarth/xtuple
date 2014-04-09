CREATE OR REPLACE FUNCTION _itemsrcpTrigger () RETURNS TRIGGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

-- Privilege Checks
   IF (NOT checkPrivilege(''MaintainItemSources'')) THEN
     RAISE EXCEPTION ''You do not have privileges to maintain Item Sources.'';
   END IF;

-- Set defaults
   NEW.itemsrcp_curr_id	:= COALESCE(NEW.itemsrcp_curr_id,basecurrid());
  
  RETURN NEW;
END;
' LANGUAGE 'plpgsql';

SELECT dropifexists('TRIGGER', 'itemsrcpTrigger');
CREATE TRIGGER itemsrcpTrigger BEFORE INSERT OR UPDATE ON itemsrcp FOR EACH ROW EXECUTE PROCEDURE _itemsrcpTrigger();
