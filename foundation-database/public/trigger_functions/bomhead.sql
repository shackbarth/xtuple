CREATE OR REPLACE FUNCTION _bomheadTrigger() RETURNS TRIGGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _revid INTEGER;
  _check TEXT;
BEGIN
-- Privilege Checks
  IF (NOT checkPrivilege(''MaintainBOMs'')) THEN
    RAISE EXCEPTION ''You do not have privileges to maintain Bills of Material.'';
  END IF;

  RETURN NEW;
END;
' LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS bomheadTrigger ON bomhead;
CREATE TRIGGER bomheadTrigger AFTER INSERT OR UPDATE OR DELETE ON bomhead FOR EACH ROW EXECUTE PROCEDURE _bomheadTrigger();
