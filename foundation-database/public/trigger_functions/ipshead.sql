CREATE OR REPLACE FUNCTION _ipsheadBeforeTrigger () RETURNS TRIGGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  --  Checks
  IF NOT (checkPrivilege(''MaintainPricingSchedules'')) THEN
    RAISE EXCEPTION ''You do not have privileges to maintain Price Schedules.'';
  END IF;

  IF (TG_OP IN (''INSERT'',''UPDATE'')) THEN
    RETURN NEW;
  ELSE
    RETURN OLD;
  END IF;
END;
' LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'ipsheadBeforeTrigger');
CREATE TRIGGER ipsheadBeforeTrigger BEFORE INSERT OR UPDATE OR DELETE ON ipshead FOR EACH ROW EXECUTE PROCEDURE _ipsheadBeforeTrigger();
