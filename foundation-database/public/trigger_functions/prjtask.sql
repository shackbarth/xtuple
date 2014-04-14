CREATE OR REPLACE FUNCTION _prjtaskTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  --  Checks
  IF (NEW.prjtask_owner_username=getEffectiveXtUser()) THEN
    IF (NOT checkPrivilege('MaintainAllProjects') AND NOT checkPrivilege('MaintainPersonalProjects')) THEN
      RAISE EXCEPTION 'You do not have privileges to maintain Projects.';
    END IF;
  ELSIF (NOT checkPrivilege('MaintainAllProjects')) THEN
    RAISE EXCEPTION 'You do not have privileges to maintain Projects.';
  ELSIF (LENGTH(COALESCE(NEW.prjtask_number,'')) = 0) THEN
    RAISE EXCEPTION 'You must ender a valid number.';
  ELSIF (LENGTH(COALESCE(NEW.prjtask_name,'')) = 0) THEN
    RAISE EXCEPTION 'You must ender a valid name.';	
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'prjtaskTrigger');
CREATE TRIGGER prjtaskTrigger BEFORE INSERT OR UPDATE ON prjtask FOR EACH ROW EXECUTE PROCEDURE _prjtaskTrigger();

CREATE OR REPLACE FUNCTION _prjtaskAfterTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _cmnttypeid INTEGER;
BEGIN

  SELECT cmnttype_id INTO _cmnttypeid
  FROM cmnttype
  WHERE (cmnttype_name='ChangeLog');
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Comment type ChangeLog not found';
  END IF;

  IF (TG_OP = 'INSERT') THEN
    PERFORM postComment(_cmnttypeid, 'TA', NEW.prjtask_id, 'Created');

  ELSIF (TG_OP = 'UPDATE') THEN
    IF (OLD.prjtask_start_date <> NEW.prjtask_start_date) THEN
      PERFORM postComment( _cmnttypeid, 'TA', NEW.prjtask_id,
                           ('Start Date Changed from ' || formatDate(OLD.prjtask_start_date) || ' to ' || formatDate(NEW.prjtask_start_date)) );
    END IF;
    IF (OLD.prjtask_due_date <> NEW.prjtask_due_date) THEN
      PERFORM postComment( _cmnttypeid, 'TA', NEW.prjtask_id,
                           ('Due Date Changed from ' || formatDate(OLD.prjtask_due_date) || ' to ' || formatDate(NEW.prjtask_due_date)) );
    END IF;
    IF (OLD.prjtask_assigned_date <> NEW.prjtask_assigned_date) THEN
      PERFORM postComment( _cmnttypeid, 'TA', NEW.prjtask_id,
                           ('Assigned Date Changed from ' || formatDate(OLD.prjtask_assigned_date) || ' to ' || formatDate(NEW.prjtask_assigned_date)) );
    END IF;
    IF (OLD.prjtask_completed_date <> NEW.prjtask_completed_date) THEN
      PERFORM postComment( _cmnttypeid, 'TA', NEW.prjtask_id,
                           ('Completed Date Changed from ' || formatDate(OLD.prjtask_completed_date) || ' to ' || formatDate(NEW.prjtask_completed_date)) );
    END IF;
    IF (OLD.prjtask_hours_actual != NEW.prjtask_hours_actual) THEN
      PERFORM postComment(_cmnttypeid, 'TA', NEW.prjtask_id, 
          'Actual Hours changed from ' || formatQty(OLD.prjtask_hours_actual) || ' to ' || formatQty(NEW.prjtask_hours_actual));
    END IF;
    IF (OLD.prjtask_exp_actual != NEW.prjtask_exp_actual) THEN
      PERFORM postComment(_cmnttypeid, 'TA', NEW.prjtask_id, 
          'Actual Expense changed from ' || formatQty(OLD.prjtask_exp_actual) || ' to ' || formatQty(NEW.prjtask_exp_actual));
    END IF;

  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'prjtaskAfterTrigger');
CREATE TRIGGER prjtaskAfterTrigger AFTER INSERT OR UPDATE ON prjtask FOR EACH ROW EXECUTE PROCEDURE _prjtaskAfterTrigger();
