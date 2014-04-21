CREATE OR REPLACE FUNCTION _itemuomconvTrigger () RETURNS TRIGGER AS '
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

DROP TRIGGER IF EXISTS itemuomconvTrigger ON itemuomconv;
CREATE TRIGGER itemuomconvTrigger AFTER INSERT OR UPDATE ON itemuomconv FOR EACH ROW EXECUTE PROCEDURE _itemuomconvTrigger();
