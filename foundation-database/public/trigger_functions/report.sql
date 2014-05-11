CREATE OR REPLACE FUNCTION _reportTrigger () RETURNS TRIGGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  NEW.report_loaddate = CURRENT_TIMESTAMP;
  RETURN NEW;

END;
' LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS reportTrigger ON report;
CREATE TRIGGER reportTrigger BEFORE INSERT OR UPDATE ON report FOR EACH ROW EXECUTE PROCEDURE _reportTrigger();
