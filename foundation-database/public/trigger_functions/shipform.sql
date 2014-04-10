CREATE OR REPLACE FUNCTION _shipformAfterDeleteTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (fetchMetricValue('DefaultShipFormId') = OLD.shipform_id) THEN
    RAISE EXCEPTION 'Cannot delete the default Shipping Form [xtuple: shipform, -1, %, %]',
                    OLD.shipform_name, OLD.shipform_report_name;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE PLPGSQL;

DROP TRIGGER IF EXISTS shipformAfterDeleteTrigger ON shipform;
CREATE TRIGGER shipformAfterDeleteTrigger AFTER DELETE ON shipform
  FOR EACH ROW EXECUTE PROCEDURE _shipformAfterDeleteTrigger();
