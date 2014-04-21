CREATE OR REPLACE FUNCTION _poheadTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _cmnttypeid 	INTEGER;
  _check	BOOLEAN;
  _maint        BOOLEAN := TRUE;

BEGIN

-- Check if we are doing maintenance
  IF (TG_OP = 'UPDATE') THEN
    IF ( (OLD.pohead_status           != NEW.pohead_status) OR
         (OLD.pohead_printed          != NEW.pohead_printed) ) THEN
      _maint := FALSE;
    END IF;
  END IF;

  -- Check
  IF ( (NOT _maint) AND (NOT checkPrivilege('MaintainPurchaseOrders'))
                    AND (NOT checkPrivilege('PostPurchaseOrders'))
                    AND (NOT checkPrivilege('PrintPurchaseOrders'))
                    AND (NOT checkPrivilege('PostVouchers')) ) THEN
    RAISE EXCEPTION 'You do not have privileges to alter a Purchase Order.';
  END IF;

  IF ( _maint AND (NOT checkPrivilege('MaintainPurchaseOrders')) ) THEN
    RAISE EXCEPTION 'You do not have privileges to alter a Purchase Order.';
  END IF;

  IF (TG_OP = 'INSERT') THEN
    --- clear the number from the issue cache
    PERFORM clearNumberIssue('PoNumber', NEW.pohead_number);
  END IF;

  IF ( (TG_OP = 'INSERT') OR (TG_op = 'UPDATE') ) THEN
    IF (NOT ISNUMERIC(NEW.pohead_number) AND NEW.pohead_saved) THEN
      RAISE EXCEPTION 'Purchase Order Number must be numeric.';
    END IF;
  END IF;

  IF ( SELECT (metric_value='t')
       FROM metric
       WHERE (metric_name='POChangeLog') ) THEN

--  Cache the cmnttype_id for ChangeLog
    SELECT cmnttype_id INTO _cmnttypeid
    FROM cmnttype
    WHERE (cmnttype_name='ChangeLog');
    IF (FOUND) THEN
      IF (TG_OP = 'INSERT') THEN
        PERFORM postComment(_cmnttypeid, 'P', NEW.pohead_id, 'Created');

      ELSIF (TG_OP = 'UPDATE') THEN
        IF (OLD.pohead_terms_id <> NEW.pohead_terms_id) THEN
          PERFORM postComment( _cmnttypeid, 'P', NEW.pohead_id,
                               ('Terms Changed from "' || oldterms.terms_code || '" to "' || newterms.terms_code || '"') )
          FROM terms AS oldterms, terms AS newterms
          WHERE ( (oldterms.terms_id=OLD.pohead_terms_id)
           AND (newterms.terms_id=NEW.pohead_terms_id) );
        END IF;

      ELSIF (TG_OP = 'DELETE') THEN
        DELETE FROM docass WHERE docass_source_id = OLD.pohead_id AND docass_source_type = 'P';
        DELETE FROM docass WHERE docass_target_id = OLD.pohead_id AND docass_target_type = 'P';

        DELETE FROM comment
        WHERE ( (comment_source='P')
         AND (comment_source_id=OLD.pohead_id) );
      END IF;
    END IF;
  END IF;

  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;

END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS poheadTrigger ON pohead;
CREATE TRIGGER poheadTrigger BEFORE INSERT OR UPDATE OR DELETE ON pohead FOR EACH ROW EXECUTE PROCEDURE _poheadTrigger();

CREATE OR REPLACE FUNCTION _poheadTriggerAfter() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  IF (COALESCE(NEW.pohead_taxzone_id,-1) <> COALESCE(OLD.pohead_taxzone_id,-1)) THEN
    UPDATE poitem SET poitem_taxtype_id=getItemTaxType(itemsite_item_id,NEW.pohead_taxzone_id)
    FROM itemsite
    WHERE ((itemsite_id=poitem_itemsite_id)
     AND (poitem_pohead_id=NEW.pohead_id));
  END IF;

  -- Do not update closed poitems
  IF (TG_OP = 'UPDATE') THEN
    IF (OLD.pohead_status != NEW.pohead_status) THEN
      UPDATE poitem
      SET poitem_status=NEW.pohead_status
      WHERE ( (poitem_pohead_id=NEW.pohead_id)
        AND   (poitem_status <> 'C') );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropifexists('TRIGGER','poheadTriggerAfter');
CREATE TRIGGER poheadTriggerAfter AFTER UPDATE ON pohead FOR EACH ROW EXECUTE PROCEDURE _poheadTriggerAfter();
