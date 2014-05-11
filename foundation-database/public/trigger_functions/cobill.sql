CREATE OR REPLACE FUNCTION _cobillBeforeTrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

BEGIN
  IF (TG_OP = 'DELETE') THEN
    DELETE FROM cobilltax
    WHERE (taxhist_parent_id=OLD.cobill_id);

    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'cobillBeforeTrigger');
CREATE TRIGGER cobillBeforeTrigger
  BEFORE INSERT OR UPDATE OR DELETE
  ON cobill
  FOR EACH ROW
  EXECUTE PROCEDURE _cobillBeforeTrigger();

CREATE OR REPLACE FUNCTION _cobillTrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _r RECORD;

BEGIN
  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  END IF;

-- Cache Billing Head
  SELECT * INTO _r
  FROM cobmisc
  WHERE (cobmisc_id=NEW.cobill_cobmisc_id);
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Billing head not found';
  END IF;

-- Insert new row
  IF (TG_OP = 'INSERT') THEN

  -- Calculate Tax
      PERFORM calculateTaxHist( 'cobilltax',
                                NEW.cobill_id,
                                COALESCE(_r.cobmisc_taxzone_id, -1),
                                NEW.cobill_taxtype_id,
                                COALESCE(_r.cobmisc_shipdate, CURRENT_DATE),
                                COALESCE(_r.cobmisc_curr_id, -1),
                                (NEW.cobill_qty * coitem_qty_invuomratio) *
                                (coitem_price / coitem_price_invuomratio) )
      FROM coitem
      WHERE (coitem_id=NEW.cobill_coitem_id);
  END IF;

-- Update row
  IF (TG_OP = 'UPDATE') THEN

  -- Calculate Tax
    IF ( (NEW.cobill_qty <> OLD.cobill_qty) OR
         (NEW.cobill_taxtype_id <> OLD.cobill_taxtype_id) ) THEN
      PERFORM calculateTaxHist( 'cobilltax',
                                NEW.cobill_id,
                                COALESCE(_r.cobmisc_taxzone_id, -1),
                                NEW.cobill_taxtype_id,
                                COALESCE(_r.cobmisc_shipdate, CURRENT_DATE),
                                COALESCE(_r.cobmisc_curr_id, -1),
                                (NEW.cobill_qty * coitem_qty_invuomratio) *
                                (coitem_price / coitem_price_invuomratio) )
      FROM coitem
      WHERE (coitem_id=NEW.cobill_coitem_id);
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'cobilltrigger');
CREATE TRIGGER cobilltrigger
  AFTER INSERT OR UPDATE OR DELETE
  ON cobill
  FOR EACH ROW
  EXECUTE PROCEDURE _cobillTrigger();
