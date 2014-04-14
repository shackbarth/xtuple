CREATE OR REPLACE FUNCTION _cobmiscBeforeTrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

BEGIN
  IF (TG_OP = 'DELETE') THEN
    DELETE FROM cobmisctax
    WHERE (taxhist_parent_id=OLD.cobmisc_id);

    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'cobmiscBeforeTrigger');
CREATE TRIGGER cobmiscBeforeTrigger
  BEFORE INSERT OR UPDATE OR DELETE
  ON cobmisc
  FOR EACH ROW
  EXECUTE PROCEDURE _cobmiscBeforeTrigger();

CREATE OR REPLACE FUNCTION _cobmiscTrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (TG_OP = 'DELETE') THEN
    -- Something can go here
    RETURN OLD;
  END IF;

-- Insert new row
  IF (TG_OP = 'INSERT') THEN

  -- Calculate Freight Tax
    IF (NEW.cobmisc_freight <> 0) THEN
      PERFORM calculateTaxHist( 'cobmisctax',
                                NEW.cobmisc_id,
                                NEW.cobmisc_taxzone_id,
                                getFreightTaxtypeId(),
                                NEW.cobmisc_invcdate,
                                NEW.cobmisc_curr_id,
                                NEW.cobmisc_freight );
    END IF;
  END IF;

-- Update row
  IF (TG_OP = 'UPDATE') THEN

  -- Calculate Tax
    IF (COALESCE(NEW.cobmisc_taxzone_id,-1) <> COALESCE(OLD.cobmisc_taxzone_id,-1)) THEN
      UPDATE cobill SET cobill_taxtype_id=getItemTaxType(itemsite_item_id,NEW.cobmisc_taxzone_id)
      FROM coitem
        JOIN itemsite ON (coitem_itemsite_id=itemsite_id)
      WHERE ((coitem_id=cobill_coitem_id)
       AND (cobill_cobmisc_id=NEW.cobmisc_id));
    END IF;
    
    IF ( (NEW.cobmisc_freight <> OLD.cobmisc_freight) OR
         (COALESCE(NEW.cobmisc_taxzone_id,-1) <> COALESCE(OLD.cobmisc_taxzone_id,-1)) OR
         (NEW.cobmisc_invcdate <> OLD.cobmisc_invcdate) OR
         (NEW.cobmisc_curr_id <> OLD.cobmisc_curr_id) ) THEN
      PERFORM calculateTaxHist( 'cobmisctax',
                                NEW.cobmisc_id,
                                NEW.cobmisc_taxzone_id,
                                getFreightTaxtypeId(),
                                NEW.cobmisc_invcdate,
                                NEW.cobmisc_curr_id,
                                NEW.cobmisc_freight );
      PERFORM calculateTaxHist( 'cobilltax',
                                cobill_id,
                                NEW.cobmisc_taxzone_id,
                                cobill_taxtype_id,
                                NEW.cobmisc_invcdate,
                                NEW.cobmisc_curr_id,
                                (cobill_qty * coitem_qty_invuomratio) *
                                (coitem_price / coitem_price_invuomratio) )
      FROM cobill JOIN coitem ON (coitem_id = cobill_coitem_id)
      WHERE (cobill_cobmisc_id = NEW.cobmisc_id);
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'cobmisctrigger');
CREATE TRIGGER cobmisctrigger
  AFTER INSERT OR UPDATE OR DELETE
  ON cobmisc
  FOR EACH ROW
  EXECUTE PROCEDURE _cobmiscTrigger();
