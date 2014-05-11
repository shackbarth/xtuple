CREATE OR REPLACE FUNCTION _quitemtrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _changelog BOOLEAN := FALSE;
  _check BOOLEAN;

BEGIN
  --  Checks
  SELECT checkPrivilege('MaintainQuotes') INTO _check;
  IF NOT (_check) THEN
    RAISE EXCEPTION 'You do not have privileges to maintain Quotes.';
  END IF;

  IF ( SELECT fetchMetricBool('SalesOrderChangeLog') ) THEN
    _changelog := TRUE;
  END IF;

  IF (TG_OP = 'INSERT') THEN
    IF (_changelog) THEN
      PERFORM postComment('ChangeLog', 'QI', NEW.quitem_id, 'Created');
    END IF;

    RETURN NEW;
  END IF;

  IF (TG_OP = 'DELETE') THEN
    DELETE FROM comment
    WHERE ( (comment_source='QI')
     AND (comment_source_id=OLD.quitem_id) );

    DELETE FROM charass
     WHERE ((charass_target_type='QI')
       AND  (charass_target_id=OLD.quitem_id));

    RETURN OLD;
  END IF;

  IF (TG_OP = 'UPDATE') THEN
    IF (_changelog) THEN
      IF (NEW.quitem_qtyord <> OLD.quitem_qtyord) THEN
        PERFORM postComment( 'ChangeLog', 'QI', NEW.quitem_id,
                             ( 'Changed Qty. Ordered from ' || formatQty(OLD.quitem_qtyord) ||
                               ' to ' || formatQty(NEW.quitem_qtyord) ) );
      END IF;

      IF (NEW.quitem_price <> OLD.quitem_price) THEN
        PERFORM postComment( 'ChangeLog', 'QI', NEW.quitem_id,
                             ( 'Changed Unit Price from ' || formatPrice(OLD.quitem_price) ||
                               ' to ' || formatPrice(NEW.quitem_price) ) );
      END IF;

      IF (NEW.quitem_scheddate <> OLD.quitem_scheddate) THEN
        PERFORM postComment( 'ChangeLog', 'QI', NEW.quitem_id,
                             ( 'Changed Sched. Date from ' || formatDate(OLD.quitem_scheddate) ||
                               ' to ' || formatDate(NEW.quitem_scheddate)) );
      END IF;
    END IF;
  END IF;

--  NEW.quitem_lastupdated = CURRENT_TIMESTAMP;

  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS quitemtrigger ON quitem;
CREATE TRIGGER quitemtrigger
  BEFORE INSERT OR UPDATE OR DELETE
  ON quitem
  FOR EACH ROW
  EXECUTE PROCEDURE _quitemtrigger();

CREATE OR REPLACE FUNCTION _quitemBeforeTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _check NUMERIC;
  _itemNumber TEXT;
BEGIN
  -- Check
  IF (NEW.quitem_scheddate IS NULL) THEN
  	RAISE EXCEPTION 'A schedule date is required.';
  END IF;

  -- If this is imported, go ahead and insert default characteristics
   IF ((TG_OP = 'INSERT') AND NEW.quitem_imported) THEN
     PERFORM updateCharAssignment('SI', NEW.quitem_id, char_id, charass_value)
     FROM (
       SELECT DISTINCT char_id, char_name, charass_value
       FROM charass, char, itemsite, item
       WHERE ((itemsite_id=NEW.quitem_itemsite_id)
       AND (itemsite_item_id=item_id)
       AND (charass_target_type='I')
       AND (charass_target_id=item_id)
       AND (charass_default)
       AND (char_id=charass_char_id))
       ORDER BY char_name) AS data;
   END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS quitemBeforeTrigger ON quitem;
CREATE TRIGGER quitemBeforeTrigger
  BEFORE INSERT OR UPDATE
  ON quitem
  FOR EACH ROW
  EXECUTE PROCEDURE _quitemBeforeTrigger();
-- TODO: there are two BEFORE triggers. should these be merged?


CREATE OR REPLACE FUNCTION _quitemAfterTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _check NUMERIC;
BEGIN

  --If auto calculate freight, recalculate quhead_freight
  IF (SELECT quhead_calcfreight FROM quhead WHERE (quhead_id=NEW.quitem_quhead_id)) THEN
    UPDATE quhead SET quhead_freight =
      (SELECT SUM(freightdata_total) FROM freightDetail('QU',
                                                        quhead_id,
                                                        quhead_cust_id,
                                                        quhead_shipto_id,
                                                        quhead_quotedate,
                                                        quhead_shipvia,
                                                        quhead_curr_id))
    WHERE quhead_id=NEW.quitem_quhead_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS quitemAfterTrigger ON quitem;
CREATE TRIGGER quitemAfterTrigger
  AFTER INSERT OR UPDATE
  ON quitem
  FOR EACH ROW
  EXECUTE PROCEDURE _quitemAfterTrigger();

