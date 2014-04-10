CREATE OR REPLACE FUNCTION _voitemBeforeTrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

BEGIN
  IF (TG_OP = 'DELETE') THEN
    DELETE FROM voitemtax
    WHERE (taxhist_parent_id=OLD.voitem_id);

    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'voitemBeforeTrigger');
CREATE TRIGGER voitemBeforeTrigger
  BEFORE INSERT OR UPDATE OR DELETE
  ON voitem
  FOR EACH ROW
  EXECUTE PROCEDURE _voitemBeforeTrigger();

CREATE OR REPLACE FUNCTION _voitemAfterTrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _r RECORD;

BEGIN
  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  END IF;

-- Cache Voucher Head
  SELECT * INTO _r
  FROM vohead
  WHERE (vohead_id=NEW.voitem_vohead_id);
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Voucher head not found';
  END IF;

-- Calculate Tax
  PERFORM calculateTaxHist( 'voitemtax',
                            NEW.voitem_id,
                            COALESCE(_r.vohead_taxzone_id, -1),
                            NEW.voitem_taxtype_id,
                            COALESCE(_r.vohead_docdate, CURRENT_DATE),
                            COALESCE(_r.vohead_curr_id, -1),
                            COALESCE(SUM(vodist_amount * -1), 0) )
  FROM vodist
  WHERE ( (vodist_vohead_id=_r.vohead_id)
    AND   (vodist_poitem_id=NEW.voitem_poitem_id) );

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'voitemAfterTrigger');
CREATE TRIGGER voitemAfterTrigger
  AFTER INSERT OR UPDATE OR DELETE
  ON voitem
  FOR EACH ROW
  EXECUTE PROCEDURE _voitemAfterTrigger();
