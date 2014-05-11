CREATE OR REPLACE FUNCTION _shipviaAfterDeleteTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (SELECT fetchMetricValue('DefaultShipViaId') = OLD.shipvia_id) THEN
    RAISE EXCEPTION 'Cannot delete the default Ship-Via [xtuple: shipvia, -1, %]',
                    OLD.shipvia_code;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE PLPGSQL;

DROP TRIGGER IF EXISTS shipviaAfterDeleteTrigger ON shipvia;
CREATE TRIGGER shipviaAfterDeleteTrigger AFTER DELETE ON shipvia
  FOR EACH ROW EXECUTE PROCEDURE _shipviaAfterDeleteTrigger();
