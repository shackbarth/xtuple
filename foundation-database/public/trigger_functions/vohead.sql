SELECT dropIfExists('TRIGGER', 'voheadBeforeTrigger');
SELECT dropIfExists('TRIGGER', 'voheadAfterTrigger');

CREATE OR REPLACE FUNCTION _voheadBeforeTrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _recurid     INTEGER;
  _newparentid INTEGER;

BEGIN
  IF (TG_OP = 'DELETE') THEN
    IF (OLD.vohead_posted) THEN
      -- Cannot delete a posted voucher
      RAISE EXCEPTION 'Cannot delete a posted voucher';
    END IF;

    /* TODO: is setting recv_invoiced and poreject_invoiced to FALSE correct?
             this behavior is inherited from the now-defunct deleteVoucher.
     */
    UPDATE recv SET recv_vohead_id = NULL,
                    recv_voitem_id = NULL,
                    recv_invoiced  = FALSE
     WHERE recv_vohead_id = OLD.vohead_id;

    UPDATE poreject SET poreject_vohead_id = NULL,
                        poreject_voitem_id = NULL,
                        poreject_invoiced  = FALSE
     WHERE poreject_vohead_id = OLD.vohead_id;

    DELETE FROM vodist    WHERE vodist_vohead_id  = OLD.vohead_id;
    DELETE FROM voheadtax WHERE taxhist_parent_id = OLD.vohead_id;
    DELETE FROM voitem    WHERE voitem_vohead_id  = OLD.vohead_id;

    SELECT recur_id INTO _recurid
      FROM recur
     WHERE ((recur_parent_id=OLD.vohead_id)
        AND (recur_parent_type='V'));
    IF (_recurid IS NOT NULL) THEN
      SELECT vohead_id INTO _newparentid
        FROM vohead
       WHERE ((vohead_recurring_vohead_id=OLD.vohead_id)
          AND (vohead_id!=OLD.vohead_id))
       ORDER BY vohead_docdate
       LIMIT 1;

      IF (_newparentid IS NULL) THEN
        DELETE FROM recur WHERE recur_id=_recurid;
      ELSE
        UPDATE recur SET recur_parent_id=_newparentid
         WHERE recur_id=_recurid;
        UPDATE vohead SET vohead_recurring_vohead_id=_newparentid
         WHERE vohead_recurring_vohead_id=OLD.vohead_id
           AND vohead_id!=OLD.vohead_id;
      END IF;
    END IF;

    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER voheadBeforeTrigger
  BEFORE INSERT OR UPDATE OR DELETE
  ON vohead
  FOR EACH ROW
  EXECUTE PROCEDURE _voheadBeforeTrigger();

CREATE OR REPLACE FUNCTION _voheadAfterTrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (TG_OP = 'DELETE') THEN
    PERFORM releaseVoNumber(CAST(OLD.vohead_number AS INTEGER));
    RETURN OLD;
  END IF;

  IF (TG_OP = 'INSERT') THEN
    PERFORM clearNumberIssue('VcNumber', NEW.vohead_number);
    RETURN NEW;
  END IF;

  IF (TG_OP = 'UPDATE') THEN
    IF ( (COALESCE(NEW.vohead_taxzone_id,-1) <> COALESCE(OLD.vohead_taxzone_id,-1)) OR
         (NEW.vohead_docdate <> OLD.vohead_docdate) OR
         (NEW.vohead_curr_id <> OLD.vohead_curr_id) ) THEN
      PERFORM calculateTaxHist( 'voitemtax',
                                voitem_id,
                                NEW.vohead_taxzone_id,
                                voitem_taxtype_id,
                                NEW.vohead_docdate,
                                NEW.vohead_curr_id,
                                (vodist_amount * -1) )
      FROM voitem JOIN vodist ON ( (vodist_vohead_id=voitem_vohead_id) AND
                                   (vodist_poitem_id=voitem_poitem_id) )
      WHERE (voitem_vohead_id = NEW.vohead_id);
    END IF;

    -- Touch any Misc Tax Distributions so voheadtax is recalculated
    IF (NEW.vohead_docdate <> OLD.vohead_docdate) THEN
      UPDATE vodist SET vodist_vohead_id=NEW.vohead_id
      WHERE ( (vodist_vohead_id=OLD.vohead_id)
        AND   (vodist_tax_id <> -1) );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER voheadAfterTrigger
  AFTER INSERT OR UPDATE OR DELETE
  ON vohead
  FOR EACH ROW
  EXECUTE PROCEDURE _voheadAfterTrigger();
