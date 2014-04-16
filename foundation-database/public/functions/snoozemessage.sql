
CREATE OR REPLACE FUNCTION snoozeMessage(INTEGER) RETURNS BOOLEAN AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pMsgid ALIAS FOR $1;
  snooze INTERVAL := ''10 minutes'';

BEGIN

  UPDATE msg
  SET msg_scheduled=(msg_scheduled + snooze)
  WHERE (msg_id=pMsgid);

  RETURN TRUE;

END;
' LANGUAGE 'plpgsql';

