CREATE OR REPLACE FUNCTION _alarmbeforetrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
  BEGIN
    PERFORM clearNumberIssue('AlarmNumber', NEW.alarm_number);

    RETURN NEW;
  END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'alarmbeforetrigger');
CREATE TRIGGER alarmbeforetrigger
  BEFORE  INSERT 
  ON alarm
  FOR EACH ROW
  EXECUTE PROCEDURE _alarmbeforetrigger();
