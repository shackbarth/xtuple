CREATE OR REPLACE FUNCTION _itemtaxTrigger () RETURNS TRIGGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

-- Privilege Checks
   IF (NOT checkPrivilege(''MaintainItemMasters'')) THEN
     RAISE EXCEPTION ''You do not have privileges to maintain Items.'';
   END IF;

  RETURN NEW;
END;
' LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS itemtaxTrigger ON itemtax;
CREATE TRIGGER itemtaxTrigger AFTER INSERT OR UPDATE ON itemtax FOR EACH ROW EXECUTE PROCEDURE _itemtaxTrigger();
