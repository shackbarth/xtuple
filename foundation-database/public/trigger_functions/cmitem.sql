CREATE OR REPLACE FUNCTION _cmitemBeforeTrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _check BOOLEAN;
  _id INTEGER;
BEGIN
  -- Checks
  -- Start with privileges
  SELECT checkPrivilege('MaintainCreditMemos') INTO _check;
  IF NOT (_check) THEN
    RAISE EXCEPTION 'You do not have privileges to maintain Credit Memos.';
  END IF;

  IF (TG_OP = 'DELETE') THEN
    DELETE FROM cmitemtax
    WHERE (taxhist_parent_id=OLD.cmitem_id);

    RETURN OLD;
  END IF;

  IF (TG_OP = 'INSERT') THEN
    IF ( (NEW.cmitem_qtycredit IS NULL) OR (NEW.cmitem_qtycredit = 0) ) THEN
      RAISE EXCEPTION 'Quantity to Credit must be greater than zero.';
    END IF;
    SELECT cmitem_id INTO _id
    FROM cmitem
    WHERE ( (cmitem_cmhead_id=NEW.cmitem_cmhead_id) AND (cmitem_linenumber=NEW.cmitem_linenumber) );
    IF (FOUND) THEN
      RAISE EXCEPTION 'The Memo Line Number is already in use.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'cmitembeforetrigger');
CREATE TRIGGER cmitembeforetrigger
  BEFORE INSERT OR UPDATE OR DELETE
  ON cmitem
  FOR EACH ROW
  EXECUTE PROCEDURE _cmitemBeforeTrigger();


CREATE OR REPLACE FUNCTION _cmitemTrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _ext NUMERIC;
  _r RECORD;

BEGIN
  IF (TG_OP = 'DELETE') THEN

--  If this was created by a return, reset return values
    IF (OLD.cmitem_raitem_id) IS NOT NULL THEN
      _ext := ROUND((OLD.cmitem_qtycredit * OLD.cmitem_qty_invuomratio) *  (OLD.cmitem_unitprice / OLD.cmitem_price_invuomratio),2);
      UPDATE raitem SET
        raitem_status = 'O',
        raitem_qtycredited = raitem_qtycredited-OLD.cmitem_qtycredit,
        raitem_amtcredited = raitem_amtcredited-_ext
      WHERE (raitem_id=OLD.cmitem_raitem_id);
    END IF;
    RETURN OLD;
  END IF;

-- Cache Credit Memo Head
  SELECT * INTO _r
  FROM cmhead
  WHERE (cmhead_id=NEW.cmitem_cmhead_id);
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Credit Memo head not found';
  END IF;

-- Insert new row
  IF (TG_OP = 'INSERT') THEN

  -- Calculate Tax
      PERFORM calculateTaxHist( 'cmitemtax',
                                NEW.cmitem_id,
                                COALESCE(_r.cmhead_taxzone_id, -1),
                                NEW.cmitem_taxtype_id,
                                COALESCE(_r.cmhead_docdate, CURRENT_DATE),
                                COALESCE(_r.cmhead_curr_id, -1),
                                (NEW.cmitem_qtycredit * NEW.cmitem_qty_invuomratio) *
                                (NEW.cmitem_unitprice / NEW.cmitem_price_invuomratio) * -1);
  END IF;

-- Update row
  IF (TG_OP = 'UPDATE') THEN

  -- Calculate Tax
    IF ( (NEW.cmitem_qtycredit <> OLD.cmitem_qtycredit) OR
         (NEW.cmitem_qty_invuomratio <> OLD.cmitem_qty_invuomratio) OR
         (NEW.cmitem_unitprice <> OLD.cmitem_unitprice) OR
         (NEW.cmitem_price_invuomratio <> OLD.cmitem_price_invuomratio) OR
         (COALESCE(NEW.cmitem_taxtype_id, -1) <> COALESCE(OLD.cmitem_taxtype_id, -1)) ) THEN
      PERFORM calculateTaxHist( 'cmitemtax',
                                NEW.cmitem_id,
                                COALESCE(_r.cmhead_taxzone_id, -1),
                                NEW.cmitem_taxtype_id,
                                COALESCE(_r.cmhead_docdate, CURRENT_DATE),
                                COALESCE(_r.cmhead_curr_id, -1),
                                (NEW.cmitem_qtycredit * NEW.cmitem_qty_invuomratio) *
                                (NEW.cmitem_unitprice / NEW.cmitem_price_invuomratio) * -1);
    END IF;
  END IF;


  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'cmitemtrigger');
CREATE TRIGGER cmitemtrigger
  AFTER INSERT OR UPDATE OR DELETE
  ON cmitem
  FOR EACH ROW
  EXECUTE PROCEDURE _cmitemTrigger();
