CREATE OR REPLACE FUNCTION _shiptoinfoAfterTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _cmnttypeid INTEGER;

BEGIN
  IF (NEW.shipto_default) THEN
    UPDATE shiptoinfo
    SET shipto_default = false
    WHERE ((shipto_cust_id=NEW.shipto_cust_id)
    AND (shipto_id <> NEW.shipto_id));
  END IF;

  IF (SELECT fetchMetricBool('CustomerChangeLog')) THEN
--  Cache the cmnttype_id for ChangeLog
    SELECT cmnttype_id INTO _cmnttypeid
    FROM cmnttype
    WHERE (cmnttype_name='ChangeLog');
    IF (FOUND) THEN
      IF (TG_OP = 'INSERT') THEN
        PERFORM postComment(_cmnttypeid, 'C', NEW.shipto_cust_id, 'Created');

      ELSIF (TG_OP = 'UPDATE') THEN
        IF (OLD.shipto_name <> NEW.shipto_name) THEN
          PERFORM postComment( _cmnttypeid, 'C', NEW.shipto_cust_id,
                               ( NEW.shipto_name || ': Ship To Name Changed from "' || COALESCE(OLD.shipto_name, '') ||
                                 '" to "' || COALESCE(NEW.shipto_name, '') || '"' ) );
        END IF;
        IF (OLD.shipto_shipvia <> NEW.shipto_shipvia) THEN
          PERFORM postComment( _cmnttypeid, 'C', NEW.shipto_cust_id,
                               ( NEW.shipto_name || ': Ship To ShipVia Changed from "' || COALESCE(OLD.shipto_shipvia, '') ||
                                 '" to "' || COALESCE(NEW.shipto_shipvia, '') || '"' ) );
        END IF;
        IF (COALESCE(OLD.shipto_taxzone_id, -1) <> COALESCE(NEW.shipto_taxzone_id, -1)) THEN
          PERFORM postComment( _cmnttypeid, 'C', NEW.shipto_cust_id,
                               ( NEW.shipto_name || ': Ship To Tax Zone Changed from "' || COALESCE((SELECT taxzone_code
                                                                                            FROM taxzone
                                                                                            WHERE taxzone_id=OLD.shipto_taxzone_id), 'None') ||
                                 '" to "' || COALESCE((SELECT taxzone_code
                                              FROM taxzone
                                              WHERE taxzone_id=NEW.shipto_taxzone_id), 'None') || '"' ) );
        END IF;
        IF (OLD.shipto_shipzone_id <> NEW.shipto_shipzone_id) THEN
          PERFORM postComment( _cmnttypeid, 'C', NEW.shipto_cust_id,
                               ( NEW.shipto_name || ': Ship To Shipping Zone Changed from "' || (SELECT shipzone_name
                                                                                                 FROM shipzone
                                                                                                 WHERE shipzone_id=OLD.shipto_shipzone_id) ||
                                 '" to "' || (SELECT shipzone_name
                                              FROM shipzone
                                              WHERE shipzone_id=NEW.shipto_shipzone_id) || '"' ) );
        END IF;
        IF (OLD.shipto_salesrep_id <> NEW.shipto_salesrep_id) THEN
          PERFORM postComment( _cmnttypeid, 'C', NEW.shipto_cust_id,
                               ( NEW.shipto_name || ': Ship To Sales Rep Changed from "' || (SELECT salesrep_name
                                                                                             FROM salesrep
                                                                                             WHERE salesrep_id=OLD.shipto_salesrep_id) ||
                                 '" to "' || (SELECT salesrep_name
                                              FROM salesrep
                                              WHERE salesrep_id=NEW.shipto_salesrep_id) || '"' ) );
        END IF;
        IF (OLD.shipto_active <> NEW.shipto_active) THEN
          IF (NEW.shipto_active) THEN
            PERFORM postComment(_cmnttypeid, 'C', NEW.shipto_cust_id, (NEW.shipto_name || ': Ship To Activated'));
          ELSE
            PERFORM postComment(_cmnttypeid, 'C', NEW.shipto_cust_id, (NEW.shipto_name || ': Ship To Deactivated'));
          END IF;
        END IF;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS shiptoinfoAfterTrigger ON shiptoinfo;
CREATE TRIGGER shiptoinfoAfterTrigger AFTER INSERT OR UPDATE ON shiptoinfo FOR EACH ROW EXECUTE PROCEDURE _shiptoinfoAfterTrigger();

