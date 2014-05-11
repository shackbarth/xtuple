CREATE OR REPLACE FUNCTION _bomitemsubTrigger() RETURNS TRIGGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

-- Privilege Checks
  IF (NOT checkPrivilege(''MaintainBOMs'')) THEN
    RAISE EXCEPTION ''You do not have privileges to maintain Bills of Material.'';
  END IF;

  IF (TG_OP = ''DELETE'') THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;

END;
' LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS bomitemsubTrigger ON bomitemsub;
CREATE TRIGGER bomitemsubTrigger BEFORE INSERT OR UPDATE OR DELETE ON bomitemsub FOR EACH ROW EXECUTE PROCEDURE _bomitemsubTrigger();
