CREATE OR REPLACE FUNCTION _cmheadBeforeTrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _check BOOLEAN;
  _id INTEGER;
BEGIN
  -- Checks
  -- Start with privileges
  SELECT checkPrivilege('MaintainCreditMemos') INTO _check;
  IF ( (TG_OP = 'INSERT') OR (TG_OP = 'DELETE') ) THEN
    IF NOT (_check) THEN
      RAISE EXCEPTION 'You do not have privileges to maintain Credit Memos.';
    END IF;
  END IF;
  IF (TG_OP = 'UPDATE') THEN
    IF ((OLD.cmhead_printed = NEW.cmhead_printed) AND NOT (_check) ) THEN
      RAISE EXCEPTION 'You do not have privileges to maintain Credit Memos.';
    END IF;
  END IF;

  IF (TG_OP = 'DELETE') THEN
    DELETE FROM cmheadtax
    WHERE (taxhist_parent_id=OLD.cmhead_id);

    RETURN OLD;
  END IF;

  IF ( (NEW.cmhead_number IS NULL) OR (LENGTH(NEW.cmhead_number) = 0) ) THEN
    RAISE EXCEPTION 'You must enter a valid Memo # for this Credit Memo.';
  END IF;

  IF (TG_OP = 'INSERT') THEN
    SELECT cmhead_id INTO _id
    FROM cmhead
    WHERE (cmhead_number=NEW.cmhead_number);
    IF (FOUND) THEN
      RAISE EXCEPTION 'The Memo # is already in use.';
    END IF;

    IF (fetchMetricText('CMNumberGeneration') IN ('A','O')) THEN
      --- clear the number from the issue cache
      PERFORM clearNumberIssue('CmNumber', NEW.cmhead_number);
    ELSIF (fetchMetricText('CMNumberGeneration') = 'S') THEN
      --- clear the number from the issue cache
      PERFORM clearNumberIssue('SoNumber', NEW.cmhead_number);
    END IF;
  END IF;

  IF (NEW.cmhead_cust_id IS NOT NULL) THEN
    SELECT cust_id INTO _id
    FROM custinfo
    WHERE (cust_id=NEW.cmhead_cust_id);
    IF (NOT FOUND) THEN
      RAISE EXCEPTION 'You must enter a valid Customer # for this Credit Memo.';
    END IF;
  END IF;

  IF ( (NEW.cmhead_misc > 0) AND (NEW.cmhead_misc_accnt_id = -1) ) THEN
    RAISE EXCEPTION 'You may not enter a Misc. Charge without indicating the G/L Sales Account.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'cmheadbeforetrigger');
CREATE TRIGGER cmheadbeforetrigger
  BEFORE INSERT OR UPDATE OR DELETE
  ON cmhead
  FOR EACH ROW
  EXECUTE PROCEDURE _cmheadBeforeTrigger();


CREATE OR REPLACE FUNCTION _cmheadTrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (TG_OP = 'DELETE') THEN
    -- If this was created by a return, then reset the return
    IF (OLD.cmhead_rahead_id IS NOT NULL) THEN
      UPDATE rahead SET
        rahead_headcredited=false
      WHERE (rahead_id=OLD.cmhead_rahead_id);
      DELETE FROM rahist
      WHERE ((rahist_rahead_id=OLD.cmhead_rahead_id)
      AND (rahist_source='CM')
      AND (rahist_source_id=OLD.cmhead_id));
    END IF;
    RETURN OLD;
  END IF;

-- Insert new row
  IF (TG_OP = 'INSERT') THEN

  -- Calculate Freight Tax
    IF (NEW.cmhead_freight <> 0) THEN
      PERFORM calculateTaxHist( 'cmheadtax',
                                NEW.cmhead_id,
                                NEW.cmhead_taxzone_id,
                                getFreightTaxtypeId(),
                                NEW.cmhead_docdate,
                                NEW.cmhead_curr_id,
                                NEW.cmhead_freight * -1 );
    END IF;
  END IF;

-- Update row
  IF (TG_OP = 'UPDATE') THEN

    IF ( (NEW.cmhead_freight <> OLD.cmhead_freight) OR
         (COALESCE(NEW.cmhead_taxzone_id,-1) <> COALESCE(OLD.cmhead_taxzone_id,-1)) OR
         (NEW.cmhead_docdate <> OLD.cmhead_docdate) OR
         (NEW.cmhead_curr_id <> OLD.cmhead_curr_id) ) THEN
  -- Calculate cmhead Tax
      PERFORM calculateTaxHist( 'cmheadtax',
                                NEW.cmhead_id,
                                NEW.cmhead_taxzone_id,
                                getFreightTaxtypeId(),
                                NEW.cmhead_docdate,
                                NEW.cmhead_curr_id,
                                NEW.cmhead_freight * -1 );
    END IF;

    IF ( (COALESCE(NEW.cmhead_taxzone_id,-1) <> COALESCE(OLD.cmhead_taxzone_id,-1)) OR
         (NEW.cmhead_docdate <> OLD.cmhead_docdate) OR
         (NEW.cmhead_curr_id <> OLD.cmhead_curr_id) ) THEN
  -- Calculate cmitem Tax
      IF (COALESCE(NEW.cmhead_taxzone_id,-1) <> COALESCE(OLD.cmhead_taxzone_id,-1)) THEN
    -- Cmitem trigger will calculate tax
        UPDATE cmitem SET cmitem_taxtype_id=getItemTaxType(itemsite_item_id,NEW.cmhead_taxzone_id)
        FROM itemsite 
        WHERE ((itemsite_id=cmitem_itemsite_id)
          AND (cmitem_cmhead_id=NEW.cmhead_id));
      ELSE
        PERFORM calculateTaxHist( 'cmitemtax',
                                  cmitem_id,
                                  NEW.cmhead_taxzone_id,
                                  cmitem_taxtype_id,
                                  NEW.cmhead_docdate,
                                  NEW.cmhead_curr_id,
                                  (cmitem_qtycredit * cmitem_qty_invuomratio) *
                                  (cmitem_unitprice / cmitem_price_invuomratio) * -1)
        FROM cmitem
        WHERE (cmitem_cmhead_id = NEW.cmhead_id);
      END IF;
    END IF;

  END IF;


  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'cmheadtrigger');
CREATE TRIGGER cmheadtrigger
  AFTER INSERT OR UPDATE OR DELETE
  ON cmhead
  FOR EACH ROW
  EXECUTE PROCEDURE _cmheadTrigger();
