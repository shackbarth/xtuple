CREATE OR REPLACE FUNCTION _evntlogAfterInsertTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _r RECORD;

BEGIN

  IF (NEW.evntlog_username = 'autopilot') THEN
    SELECT * INTO _r FROM evnttype WHERE (evnttype_id=NEW.evntlog_evnttype_id);
    IF (_r.evnttype_name = 'SoCreated') THEN
      PERFORM createPrjToSale(NEW.evntlog_ord_id);
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'evntlogAfterInsertTrigger');
CREATE TRIGGER evntlogAfterInsertTrigger AFTER INSERT ON evntlog
       FOR EACH ROW EXECUTE PROCEDURE _evntlogAfterInsertTrigger();
