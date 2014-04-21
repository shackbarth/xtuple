CREATE OR REPLACE FUNCTION _woTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

BEGIN

  IF (TG_OP = 'INSERT') THEN
    PERFORM postEvent('WoCreated', 'W', NEW.wo_id,
                      itemsite_warehous_id,
                      (NEW.wo_number || '-' || NEW.wo_subnumber),
                      NULL, NULL, NULL, NULL)
    FROM itemsite
    WHERE (itemsite_id=NEW.wo_itemsite_id)
      AND (NEW.wo_duedate <= (CURRENT_DATE + itemsite_eventfence));

    PERFORM postComment('ChangeLog', 'W', NEW.wo_id, 'Created');

    IF (fetchMetricText('WONumberGeneration') IN ('A','O')) THEN
      --- clear the number from the issue cache
      PERFORM clearNumberIssue('WoNumber', NEW.wo_number);
    END IF;

    RETURN NEW;

  ELSE
      IF (TG_OP = 'DELETE') THEN
      PERFORM postEvent('WoCancelled', 'W', OLD.wo_id,
                        itemsite_warehous_id,
                        (OLD.wo_number || '-' || OLD.wo_subnumber),
                        NULL, NULL, NULL, NULL)
      FROM itemsite
      WHERE (itemsite_id=OLD.wo_itemsite_id)
        AND (OLD.wo_duedate <= (CURRENT_DATE + itemsite_eventfence));

      DELETE FROM docass WHERE docass_source_id = OLD.wo_id AND docass_source_type = 'W';
      DELETE FROM docass WHERE docass_target_id = OLD.wo_id AND docass_target_type = 'W';

      DELETE FROM comment
      WHERE ( (comment_source='W')
       AND (comment_source_id=OLD.wo_id) );

      DELETE FROM charass
       WHERE ((charass_target_type='W')
         AND  (charass_target_id=OLD.wo_id));

       RETURN OLD;

    ELSE
      IF (TG_OP = 'UPDATE') THEN

        IF (NEW.wo_qtyord <> OLD.wo_qtyord) THEN
          PERFORM postEvent('WoQtyChanged', 'W', NEW.wo_id,
                            itemsite_warehous_id,
                            (NEW.wo_number || '-' || NEW.wo_subnumber),
                            NEW.wo_qtyord, OLD.wo_qtyord, NULL, NULL)
          FROM itemsite
          WHERE (itemsite_id=NEW.wo_itemsite_id)
            AND ( (NEW.wo_duedate <= (CURRENT_DATE + itemsite_eventfence))
             OR   (OLD.wo_duedate <= (CURRENT_DATE + itemsite_eventfence)) );

          PERFORM postComment( 'ChangeLog', 'W', NEW.wo_id,
                               ( 'Qty. Ordered Changed from ' || formatQty(OLD.wo_qtyord) ||
                                 ' to ' || formatQty(NEW.wo_qtyord ) ) );
        END IF;

        IF (NEW.wo_duedate <> OLD.wo_duedate) THEN
          PERFORM postEvent('WoDueDateChanged', 'W', NEW.wo_id,
                            itemsite_warehous_id,
                            (NEW.wo_number || '-' || NEW.wo_subnumber),
                            NULL, NULL, NEW.wo_duedate, OLD.wo_duedate)
          FROM itemsite
          WHERE (itemsite_id=NEW.wo_itemsite_id)
            AND ( (NEW.wo_duedate <= (CURRENT_DATE + itemsite_eventfence))
             OR   (OLD.wo_duedate <= (CURRENT_DATE + itemsite_eventfence)) );

          PERFORM postComment( 'ChangeLog', 'W', NEW.wo_id,
                               ( 'Due Date Changed from ' || formatDate(OLD.wo_duedate) ||
                                 ' to ' || formatDate(NEW.wo_duedate ) ) );
        END IF;

        IF (NEW.wo_status <> OLD.wo_status) THEN
          PERFORM postComment( 'ChangeLog', 'W', NEW.wo_id,
                               ('Status Changed from ' || OLD.wo_status || ' to ' || NEW.wo_status) );
        END IF;

      END IF;
    END IF;
  END IF;

  IF (TG_OP = 'UPDATE') THEN
    IF (NEW.wo_prj_id <> OLD.wo_prj_id) THEN
      UPDATE wo SET wo_prj_id=NEW.wo_prj_id
      WHERE (wo_ordtype='W')
        AND (wo_ordid=NEW.wo_id);
    END IF;
  END IF;

  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS woTrigger ON wo;
CREATE TRIGGER woTrigger BEFORE INSERT OR UPDATE OR DELETE ON wo FOR EACH ROW EXECUTE PROCEDURE _woTrigger();
