
CREATE OR REPLACE FUNCTION deleteTodoItem(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  ptodoItemId ALIAS FOR $1;
BEGIN
  DELETE FROM alarm WHERE ( (alarm_source=''TODO'') AND (alarm_source_id=ptodoItemId) );
  DELETE FROM todoitem WHERE todoitem_id = ptodoItemId;
  RETURN 0;
END;
' LANGUAGE 'plpgsql';

