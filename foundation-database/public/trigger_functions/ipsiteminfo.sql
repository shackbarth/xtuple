CREATE OR REPLACE FUNCTION _ipsiteminfoBeforeTrigger () RETURNS TRIGGER AS $$
BEGIN

  --  Checks
  IF NOT (checkPrivilege('MaintainPricingSchedules')) THEN
    RAISE EXCEPTION 'You do not have privileges to maintain Price Schedules.';
  END IF;
  
  IF (TG_OP IN ('INSERT','UPDATE')) THEN
    RETURN NEW;
  ELSE
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'ipsiteminfoBeforeTrigger');
CREATE TRIGGER ipsiteminfoBeforeTrigger BEFORE INSERT OR UPDATE OR DELETE ON ipsiteminfo FOR EACH ROW EXECUTE PROCEDURE _ipsiteminfoBeforeTrigger();
