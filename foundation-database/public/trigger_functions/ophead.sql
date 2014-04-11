CREATE OR REPLACE FUNCTION _opheadBeforeTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _rec record;
  _check boolean;
  _test text;
BEGIN

  IF(TG_OP = 'DELETE') THEN
    _rec := OLD;
  ELSE
    _rec := NEW;
  END IF;

  --  Auto inactivate
  IF (TG_OP = 'UPDATE') THEN
    IF ( (NEW.ophead_opstage_id != OLD.ophead_opstage_id) AND
         (SELECT opstage_opinactive FROM opstage WHERE opstage_id=NEW.ophead_opstage_id) ) THEN
      NEW.ophead_active := FALSE;
    END IF;
  END IF;

  IF (TG_OP = 'INSERT') THEN
    IF (SELECT opstage_opinactive FROM opstage WHERE opstage_id=NEW.ophead_opstage_id) THEN
      NEW.ophead_active := FALSE;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'opheadBeforeTrigger');
CREATE TRIGGER opheadBeforeTrigger BEFORE INSERT OR UPDATE ON ophead 
FOR EACH ROW EXECUTE PROCEDURE _opheadBeforeTrigger();

CREATE OR REPLACE FUNCTION _opheadAfterTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _cmnttypeid INTEGER;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    DELETE FROM docass WHERE docass_source_id = OLD.ophead_id AND docass_source_type = 'OPP';
    DELETE FROM docass WHERE docass_target_id = OLD.ophead_id AND docass_target_type = 'OPP';
  END IF;
  
  --  Comments
  IF ( SELECT (metric_value='t') FROM metric WHERE (metric_name='OpportunityChangeLog') ) THEN

    --  Cache the cmnttype_id for ChangeLog
    SELECT cmnttype_id INTO _cmnttypeid
    FROM cmnttype
    WHERE (cmnttype_name='ChangeLog');
    IF (FOUND) THEN
      IF (TG_OP = 'INSERT') THEN
        PERFORM postComment(_cmnttypeid, 'OPP', NEW.ophead_id, 'Created');

        --- clear the number from the issue cache
        PERFORM clearNumberIssue('OpportunityNumber', NEW.ophead_number);
      ELSIF (TG_OP = 'UPDATE') THEN
        IF (OLD.ophead_active <> NEW.ophead_active) THEN
          IF (NEW.ophead_active) THEN
            PERFORM postComment(_cmnttypeid, 'OPP', NEW.ophead_id, 'Activated');
          ELSE
            PERFORM postComment(_cmnttypeid, 'OPP', NEW.ophead_id, 'Deactivated');
          END IF;
        END IF;

        IF (OLD.ophead_name <> NEW.ophead_name) THEN
          PERFORM postComment( _cmnttypeid, 'OPP', NEW.ophead_id,
                               ( 'Name Changed from "' || OLD.ophead_name ||
                                 '" to "' || NEW.ophead_name || '"' ) );
        END IF;

        IF (OLD.ophead_owner_username <> NEW.ophead_owner_username) THEN
          PERFORM postComment( _cmnttypeid, 'OPP', NEW.ophead_id,
                               ( 'Owner Name Changed from "' || OLD.ophead_owner_username ||
                                 '" to "' || NEW.ophead_owner_username || '"' ) );
        END IF;

        IF (OLD.ophead_probability_prcnt <> NEW.ophead_probability_prcnt) THEN
          PERFORM postComment( _cmnttypeid, 'OPP', NEW.ophead_id,
                               ( 'Probability % Changed from "' || OLD.ophead_probability_prcnt ||
                                 '" to "' || NEW.ophead_probability_prcnt || '"' ) );
        END IF;

        IF (OLD.ophead_amount <> NEW.ophead_amount) THEN
          PERFORM postComment( _cmnttypeid, 'OPP', NEW.ophead_id,
                               ( 'Amount Changed from "' || OLD.ophead_amount ||
                                 '" to "' || NEW.ophead_amount || '"' ) );
        END IF;

        IF (OLD.ophead_target_date <> NEW.ophead_target_date) THEN
          PERFORM postComment( _cmnttypeid, 'OPP', NEW.ophead_id,
                               ( 'Target Date Changed from "' || OLD.ophead_target_date ||
                                 '" to "' || NEW.ophead_target_date || '"' ) );
        END IF;

        IF (OLD.ophead_actual_date <> NEW.ophead_actual_date) THEN
          PERFORM postComment( _cmnttypeid, 'OPP', NEW.ophead_id,
                               ( 'Actual Date Changed from "' || OLD.ophead_actual_date ||
                                 '" to "' || NEW.ophead_actual_date || '"' ) );
        END IF;

        IF (OLD.ophead_crmacct_id <> NEW.ophead_crmacct_id) THEN
          PERFORM postComment( _cmnttypeid, 'OPP', NEW.ophead_id,
                               ( 'CRM Account Changed from "' ||
                                 (SELECT crmacct_name FROM crmacct WHERE crmacct_id=OLD.ophead_crmacct_id) ||
                                 '" (' || OLD.ophead_crmacct_id ||
                                 ') to "' ||
                                 (SELECT crmacct_name FROM crmacct WHERE crmacct_id=NEW.ophead_crmacct_id) ||
                                 '" (' || NEW.ophead_crmacct_id || ')' ) );
        END IF;

        IF (OLD.ophead_curr_id <> NEW.ophead_curr_id) THEN
          PERFORM postComment( _cmnttypeid, 'OPP', NEW.ophead_id,
                               ( 'Currency Changed from "' ||
                                 (SELECT curr_name FROM curr_symbol WHERE curr_id=OLD.ophead_curr_id) ||
                                 '" (' || OLD.ophead_curr_id ||
                                 ') to "' ||
                                 (SELECT curr_name FROM curr_symbol WHERE curr_id=NEW.ophead_curr_id) ||
                                 '" (' || NEW.ophead_curr_id || ')' ) );
        END IF;

        IF (OLD.ophead_opstage_id <> NEW.ophead_opstage_id) THEN
          PERFORM postComment( _cmnttypeid, 'OPP', NEW.ophead_id,
                               ( 'Stage Changed from "' ||
                                 (SELECT opstage_name FROM opstage WHERE opstage_id=OLD.ophead_opstage_id) ||
                                 '" (' || OLD.ophead_opstage_id ||
                                 ') to "' ||
                                 (SELECT opstage_name FROM opstage WHERE opstage_id=NEW.ophead_opstage_id) ||
                                 '" (' || NEW.ophead_opstage_id || ')' ) );
        END IF;

        IF (OLD.ophead_opsource_id <> NEW.ophead_opsource_id) THEN
          PERFORM postComment( _cmnttypeid, 'OPP', NEW.ophead_id,
                               ( 'Source Changed from "' ||
                                 (SELECT opsource_name FROM opsource WHERE opsource_id=OLD.ophead_opsource_id) ||
                                 '" (' || OLD.ophead_opsource_id ||
                                 ') to "' ||
                                 (SELECT opsource_name FROM opsource WHERE opsource_id=NEW.ophead_opsource_id) ||
                                 '" (' || NEW.ophead_opsource_id || ')' ) );
        END IF;

        IF (OLD.ophead_optype_id <> NEW.ophead_optype_id) THEN
          PERFORM postComment( _cmnttypeid, 'OPP', NEW.ophead_id,
                               ( 'Type Changed from "' ||
                                 (SELECT optype_name FROM optype WHERE optype_id=OLD.ophead_optype_id) ||
                                 '" (' || OLD.ophead_optype_id ||
                                 ') to "' ||
                                 (SELECT optype_name FROM optype WHERE optype_id=NEW.ophead_optype_id) ||
                                 '" (' || NEW.ophead_optype_id || ')' ) );
        END IF;

      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'opheadAfterTrigger');
CREATE TRIGGER opheadAfterTrigger AFTER INSERT OR UPDATE OR DELETE ON ophead 
FOR EACH ROW EXECUTE PROCEDURE _opheadAfterTrigger();
